import Router from "@koa/router";
import { BadRequest, InternalServerError, isHttpError } from "http-errors";
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

export async function createActionByName(kind: string) {
  const kindResult = await query<Action>(
    sql`select id from kinds where name = ${kind};`
  );
  // FW: this should be included in some queryOne(), also it shuold check that !(count > 1)
  if (kindResult.rowCount === 0) {
    throw new BadRequest(`Unknown kind: ${kind}`);
  }

  return createAction(kindResult.rows[0].id);
}

export async function createAction(kindId: number) {
  // FW: insertOne()?
  const result = await query<Action>(
    sql`insert into actions ( kind_id ) values ( ${kindId} ) returning *;`
  );
  if (result.rowCount !== 1) {
    throw new Error(`Insert failed`);
  }
  return result.rows[0];
}

export const actionsRouter = new Router();

actionsRouter.get("/actions", async (ctx) => {
  const actions = await getActions();
  ctx.body = { actions };
});
actionsRouter.post("/actions", async (ctx) => {
  const { kind } = ctx.body;
  if (!kind || typeof kind !== "string") {
    ctx.status = 400;
    return;
  }
  const action = await createActionByName(kind);
  ctx.body = { action };
});
