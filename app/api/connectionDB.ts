import { Pool } from "pg";

const globalForPostgres = globalThis as typeof globalThis & {
  solaxProductsPool?: Pool;
};

export function getDatabaseConnection() {
  const connectionString = "postgresql://postgres:postgres@localhost:5432/mb_solar";

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  globalForPostgres.solaxProductsPool ??= new Pool({ connectionString });
  return globalForPostgres.solaxProductsPool;
}
