import { createHash, timingSafeEqual } from 'node:crypto';
import { Client } from 'pg';
import { schemaSql } from './schema';
import { seedPartnerIds, seedPartnersSql } from './seed-partners';
import { catalogImageLinks, catalogProductSlugs, catalogSeedSql, catalogSolutionTitles } from './seed-catalog';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const expectedTables = [
  'brands', 'categories', 'construction_project_images',
  'construction_projects', 'images', 'partner_profiles', 'partners',
  'product_images', 'products', 'solution_images', 'solutions',
];

class SetupError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
  }
}

function json(body: Record<string, unknown>, status = 200) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
  });
}

function authorize(request: Request) {
  const expected = process.env.DB_SETUP_TOKEN;
  if (!expected) return json({ error: 'NOT_FOUND' }, 404);
  if (expected.length < 32) {
    return json({ error: 'SETUP_TOKEN_TOO_SHORT', message: 'DB_SETUP_TOKEN must contain at least 32 characters.' }, 503);
  }
  const supplied = request.headers.get('authorization')?.match(/^Bearer (.+)$/i)?.[1];
  if (!supplied) return json({ error: 'UNAUTHORIZED' }, 401);
  const hash = (value: string) => createHash('sha256').update(value).digest();
  if (!timingSafeEqual(hash(supplied), hash(expected))) {
    return json({ error: 'UNAUTHORIZED' }, 401);
  }
  return null;
}

async function inspect(client: Client) {
  const info = await client.query<{ database_name: string; database_user: string }>(
    'SELECT current_database() AS database_name, current_user AS database_user',
  );
  const result = await client.query<{ tablename: string }>(
    "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public' ORDER BY tablename",
  );
  const tables = result.rows.map((row) => row.tablename);
  const partners = tables.includes('partners')
    ? await client.query<{ count: number }>('SELECT count(*)::int AS count FROM public.partners')
    : null;
  return {
    ...info.rows[0],
    schema: 'public',
    table_count: tables.length,
    tables,
    partners_total: partners?.rows[0].count ?? null,
    missing_expected_tables: expectedTables.filter((name) => !tables.includes(name)),
  };
}

async function withDatabase(request: Request, action: (client: Client) => Promise<Response>) {
  const denied = authorize(request);
  if (denied) return denied;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return json({ error: 'MISSING_DATABASE_URL', message: 'Set DATABASE_URL in the application runtime environment and redeploy.' }, 503);
  }

  let client: Client | undefined;
  try {
    client = new Client({
      connectionString,
      connectionTimeoutMillis: 8000,
      statement_timeout: 45000,
      query_timeout: 55000,
      application_name: 'mb-solar-db-setup',
    });
    // Never log the connection URL or database password.
    client.on('error', () => console.error('[db-setup] Database connection interrupted.'));
    await client.connect();
    return await action(client);
  } catch (error: unknown) {
    if (error instanceof SetupError) {
      return json({ error: error.code, message: error.message }, error.status);
    }
    const rawCode = (error as { code?: unknown })?.code;
    const code = typeof rawCode === 'string' && /^[A-Z0-9_]+$/.test(rawCode)
      ? rawCode : 'DB_SETUP_FAILED';
    const messages: Record<string, string> = {
      ENOTFOUND: 'The application cannot resolve the internal database hostname. Check DATABASE_URL and the internal network assignment.',
      EAI_AGAIN: 'Internal DNS resolution failed temporarily. Check the application network and try again.',
      ECONNREFUSED: 'The database refused the connection. Check its status and the internal port.',
      ETIMEDOUT: 'Database connection timed out. Check the application-to-database internal network.',
      '28P01': 'Database authentication failed. Check the runtime DATABASE_URL credentials.',
      '3D000': 'The database named by DATABASE_URL does not exist. Use the existing database name supplied by Vibe.',
      '42501': 'The database user lacks permission to create the required objects in public.',
      '23505': 'A unique key or primary-image assignment conflicts with existing data. This attempt was rolled back; existing data was not deleted.',
      '57014': 'A database statement timed out. This attempt was rolled back.',
    };
    console.error('[db-setup] Failed with code:', code);
    return json({
      error: code,
      message: messages[code] ?? 'Database operation failed. Share this error code for diagnosis; do not share DATABASE_URL.',
    }, 500);
  } finally {
    await client?.end().catch(() => undefined);
  }
}

// Read-only: identify the actual database and list its public tables.
export async function GET(request: Request) {
  return withDatabase(request, async (client) => json({ ok: true, catalog_seed_available: true, ...await inspect(client) }));
}

// Runs only fixed reviewed seeds; no SQL is accepted from requests.
// Existing callers keep the partner-only behavior. Catalog import is explicit.
export async function POST(request: Request) {
  return withDatabase(request, async (client) => {
    const seed = new URL(request.url).searchParams.get('seed') ?? 'partners';
    if (seed !== 'partners' && seed !== 'catalog') {
      return json({ error: 'INVALID_SEED', message: 'Supported seed modes: partners, catalog.' }, 400);
    }
    await client.query('BEGIN');
    try {
      const lock = await client.query<{ acquired: boolean }>(
        'SELECT pg_try_advisory_xact_lock(178463592, 1) AS acquired',
      );
      if (!lock.rows[0].acquired) {
        throw new SetupError(409, 'SETUP_IN_PROGRESS', 'Another schema setup is running. Wait for it to finish.');
      }
      const before = await inspect(client);
      await client.query("SET LOCAL lock_timeout = '5s'");
      let createdTables = 0;
      if (seed === 'catalog' && before.missing_expected_tables.length !== 0) {
        throw new SetupError(409, 'SCHEMA_INCOMPLETE', 'Run the initial database setup first. Catalog import requires the existing application tables.');
      }
      if (before.table_count === 0) {
        const namespace = await client.query("SELECT 1 FROM pg_catalog.pg_namespace WHERE nspname = 'public'");
        if (namespace.rowCount === 0) await client.query('CREATE SCHEMA public');
        await client.query(schemaSql);
        createdTables = expectedTables.length;
      } else if (before.missing_expected_tables.length !== 0) {
        throw new SetupError(409, 'SCHEMA_INCOMPLETE', 'The public schema contains tables but is missing expected application tables. No schema or seed changes were made.');
      }
      await client.query('SET LOCAL search_path TO public');
      if (seed === 'catalog') {
        await client.query(catalogSeedSql);
        const verified = await client.query<{ products: number; solutions: number; image_links: number }>(
          `SELECT
            (SELECT count(*)::int FROM public.products WHERE slug = ANY($1::text[])) AS products,
            (SELECT count(DISTINCT title)::int FROM public.solutions WHERE title = ANY($2::text[])) AS solutions,
            (SELECT count(*)::int FROM jsonb_to_recordset($3::jsonb) AS expected(path text, slug text)
              JOIN public.products p ON p.slug = expected.slug
              JOIN public.images i ON i.path = expected.path
              JOIN public.product_images pi ON pi.product_id = p.id AND pi.image_id = i.id) AS image_links`,
          [catalogProductSlugs, catalogSolutionTitles, JSON.stringify(catalogImageLinks)],
        );
        const applied = verified.rows[0];
        if (applied.products !== catalogProductSlugs.length || applied.solutions !== catalogSolutionTitles.length || applied.image_links !== catalogImageLinks.length) {
          throw new SetupError(500, 'SEED_VERIFICATION_FAILED', 'Catalog verification failed. This attempt was rolled back.');
        }
        const totals = await client.query<Record<string, number>>(`SELECT
          (SELECT count(*)::int FROM public.brands) AS brands,
          (SELECT count(*)::int FROM public.categories) AS categories,
          (SELECT count(*)::int FROM public.products) AS products,
          (SELECT count(*)::int FROM public.images) AS images,
          (SELECT count(*)::int FROM public.product_images) AS product_images,
          (SELECT count(*)::int FROM public.solutions) AS solutions,
          (SELECT count(*)::int FROM public.solution_images) AS solution_images,
          (SELECT count(*)::int FROM public.partners) AS partners,
          (SELECT count(*)::int FROM public.partner_profiles) AS partner_profiles,
          (SELECT count(*)::int FROM public.construction_projects) AS construction_projects,
          (SELECT count(*)::int FROM public.construction_project_images) AS construction_project_images,
          (SELECT count(*)::int FROM public.products p WHERE NOT EXISTS
            (SELECT 1 FROM public.product_images pi WHERE pi.product_id = p.id)) AS products_without_images`);
        const after = await inspect(client);
        await client.query('COMMIT');
        return json({ ok: true, mode: 'seed-catalog-only', catalog_records_verified: applied, totals: totals.rows[0], ...after });
      }
      await client.query(seedPartnersSql);
      const verifiedSeed = await client.query<{ count: number }>(
        'SELECT count(*)::int AS count FROM public.partners WHERE id = ANY($1::integer[])',
        [seedPartnerIds],
      );
      if (verifiedSeed.rows[0].count !== seedPartnerIds.length) {
        throw new SetupError(500, 'SEED_VERIFICATION_FAILED', 'Partner seed verification failed. This attempt was rolled back.');
      }
      const after = await inspect(client);
      if (after.missing_expected_tables.length) {
        throw new SetupError(500, 'SCHEMA_VERIFICATION_FAILED', 'Schema verification failed. The transaction was rolled back.');
      }
      await client.query('COMMIT');
      return json({
        ok: true,
        mode: createdTables ? 'initialize-and-seed' : 'seed-partners-only',
        created_tables: createdTables,
        seed_records_applied: seedPartnerIds.length,
        ...after,
      });
    } catch (error) {
      await client.query('ROLLBACK').catch(() => undefined);
      throw error;
    }
  });
}
