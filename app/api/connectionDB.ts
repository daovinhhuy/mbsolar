import { Pool } from "pg";

const globalForPostgres = globalThis as typeof globalThis & {
  solaxProductsPool?: Pool;
};

export function getDatabaseConnection() {
  const connectionString = process.env.DATABASE_URL?.trim();

  if (!connectionString) {
    throw new Error("DATABASE_URL must be set to connect to PostgreSQL");
  }

  globalForPostgres.solaxProductsPool ??= new Pool({ connectionString });
  return globalForPostgres.solaxProductsPool;
}
