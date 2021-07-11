import { query, sql } from "./db";

interface Action {
  id: number;
  kind: string;
  createAt: string;
}

export async function getActions() {
  const result = await query<Action>(sql`select * from actions;`);
  return result.rows;
}

export async function createAction({ kind }: { kind: string }) {
  const result = await query<Action>(
    sql`insert into actions ( kind ) values ( ${kind} ) returning *;`
  );
  return result.rows[0];
}
