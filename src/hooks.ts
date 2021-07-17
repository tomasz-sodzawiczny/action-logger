import { query, sql } from "./db";
import crypto from "crypto";
import { createAction } from "./action";
import { InternalServerError, NotFound } from "http-errors";
import Router from "@koa/router";

// FW: when generating this, id should be id type
interface Hook {
  id: number;
  kind_id: number;
  name: string;
  token: string;
}

const TOKEN_LENGTH = 24;
function generateHookToken() {
  return crypto
    .randomBytes(TOKEN_LENGTH)
    .toString("base64")
    .replace(/\//g, "_")
    .replace(/\+/g, "-");
}

export async function getHooks() {
  const result = await query<Hook>(sql`select * from hooks;`);
  return result.rows;
}

export async function createHook({ kind_id }: { kind_id: number }) {
  const token = generateHookToken();

  // FW: insertOne()?
  const result = await query<Hook>(
    sql`insert into hooks ( kind_id, token ) values ( ${kind_id}, ${token} ) returning *;`
  );
  if (result.rowCount !== 1) {
    throw new InternalServerError(`Insert failed`);
  }
  return result.rows[0];
}

export async function handleHook(token: string) {
  const result = await query<Hook>(
    sql`select * from hooks where token = ${token}`
  );
  if (result.rowCount === 0) {
    throw new NotFound();
  }
  return createAction(result.rows[0].kind_id);
}

export const hooksRouter = new Router();

hooksRouter.get("/hooks", async (ctx) => {
  const hooks = await getHooks();
  ctx.body = { hooks };
});
hooksRouter.post("/hooks", async (ctx) => {
  const { kind_id } = ctx.body;
  const hook = createHook({ kind_id });
  ctx.body = { hook };
});

export const hooksTriggerRouter = new Router();
hooksTriggerRouter.post("/:token", async (ctx) => {
  const { token } = ctx.params;
  const hook = await handleHook(token);
  ctx.body = { hook };
});
