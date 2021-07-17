import { query, sql } from "./db";

interface Action {
  id: number;
  kind_id: number;
  createAt: string;
}

export async function getActions() {
  const result = await query<Action>(sql`select * from actions;`);
  return result.rows;
}

export async function createAction({ kind }: { kind: string }) {
  try {
    const kindResult = await query<Action>(
      sql`select id from kinds where name = ${kind};`
    );
    // FW: this should be included in some queryOne(), also it shuold check that !(count > 1)
    if (kindResult.rowCount === 0) {
      throw new Error(`Unknown kind: ${kind}`);
    }

    // FW: insertOne()?
    const result = await query<Action>(
      sql`insert into actions ( kind_id ) values ( ${kindResult.rows[0].id} ) returning *;`
    );
    if (kindResult.rowCount !== 1) {
      throw new Error(`Insert failed`);
    }
    return result.rows[0];
  } catch (e) {
    // FW chaining errors
    throw new Error(`Insert failed: ${e}`);
  }
}
