import mysql from "mysql2/promise";

declare global {
  var __rsdPool: mysql.Pool | undefined;
}

/**
 * A lazily-created, process-wide connection pool.
 *
 * `mysql2` pools don't open a real connection until the first query runs,
 * so importing this module (including at `next build` time, for routes
 * that aren't force-dynamic) never touches the network. Cached on
 * `globalThis` so hot-reload in dev doesn't leak a new pool per edit.
 */
function getPool(): mysql.Pool {
  if (!global.__rsdPool) {
    global.__rsdPool = mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 5,
      maxIdle: 5,
      idleTimeout: 60000,
      queueLimit: 0,
      dateStrings: true,
    });
  }
  return global.__rsdPool;
}

/**
 * Run a parameterized query and get back just the rows.
 * Always use `?` placeholders + a params array — never string-concatenate
 * user input into `sql`.
 */
export async function query<T = unknown>(
  sql: string,
  params: ReadonlyArray<unknown> = []
): Promise<T[]> {
  const pool = getPool();
  const [rows] = await pool.query(sql, params as unknown[]);
  return rows as T[];
}

/** Run a single INSERT/UPDATE/DELETE and get back the result metadata. */
export async function execute(
  sql: string,
  params: ReadonlyArray<unknown> = []
): Promise<mysql.ResultSetHeader> {
  const pool = getPool();
  const [result] = await pool.query(sql, params as unknown[]);
  return result as mysql.ResultSetHeader;
}
