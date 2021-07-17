import { query, sql } from "./db";

// FW: when generating this, id should be id type
interface Kind {
  id: number;
  name: number;
}

export async function getKinds() {
  const result = await query<Kind>(sql`select * from kinds;`);
  return result.rows;
}

export async function getKind(id: number) {
  const result = await query<Kind>(sql`select * from kinds where id = ${id};`);
  return result.rows[0];
}

export async function createKind({ name }: { name: string }) {
  const result = await query<Kind>(
    sql`insert into kinds ( name ) values ( ${name} ) returning *;`
  );
  return result.rows[0];
}
