import { Pool } from "pg";
import sql from "sql-template-strings";

let pool: Pool = null;

function getPool(): Pool {
  if (!pool) {
    pool = new Pool();
  }
  return pool;
}

const query: typeof pool.query = (...args: any[]) => {
  // @ts-ignore
  return getPool().query(...args);
};

export { query, sql };
