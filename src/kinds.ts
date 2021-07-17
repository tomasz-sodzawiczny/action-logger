import Router from "@koa/router";
import { NotFound } from "http-errors";
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
  if (result.rowCount < 1) {
    throw new NotFound(`No kind with id ${id}`);
  }
  return result.rows[0];
}

export async function createKind({ name }: { name: string }) {
  const result = await query<Kind>(
    sql`insert into kinds ( name ) values ( ${name} ) returning *;`
  );
  return result.rows[0];
}

export const kindsRouter = new Router();

kindsRouter.get("/kinds", async (ctx) => {
  const kinds = await getKinds();
  ctx.body = { kinds };
});
kindsRouter.get("/kinds/:id", async (ctx) => {
  // @ts-ignore TODO
  const kind = await getKind(ctx.params.id);
  ctx.body = { kind };
});
kindsRouter.post("/kinds", async (ctx) => {
  const { name } = ctx.body;
  const kind = createKind({ name });
  ctx.body = { kind };
});
