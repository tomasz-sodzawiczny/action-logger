import { client, sql } from "./db";

interface Action {
  id: number;
  kind: string;
  createAt: string;
}

export async function getActions() {
  const response = await client.query<Action>(sql`select * from actions;`);
  return response.rows;
}

export async function createAction({ kind }: { kind: string }) {
  const createResponse = await client.query<Action>(
    sql`insert into actions ( kind ) values ( ${kind} ) returning *;`
  );
  return createResponse.rows[0];
}
