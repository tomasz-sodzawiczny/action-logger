import { config as dotenv } from "dotenv";
import Koa from "koa";
import Router from "@koa/router";
import helmet from "koa-helmet";
import morgan from "koa-morgan";
import { createActionByName, getActions } from "./action";
import { createHook, getHooks, handleHook } from "./hooks";
import { createKind, getKind, getKinds } from "./kinds";

dotenv();

const app = new Koa();
const router = new Router();

app.use(helmet());
app.use(morgan("default"));

router.get("/actions", async (ctx) => {
  const actions = await getActions();
  ctx.body = { actions };
});
// FW: express cant handle promise rejection
router.post("/actions", async (ctx) => {
  const { kind } = ctx.body;
  if (!kind || typeof kind !== "string") {
    ctx.status = 400;
    return;
  }
  const action = await createActionByName(kind);
  ctx.body = { action };
});

router.get("/kinds", async (ctx) => {
  const kinds = await getKinds();
  ctx.body = { kinds };
});
router.get("/kinds/:id", async (ctx) => {
  // @ts-ignore TODO
  const kind = await getKind(ctx.params.id);
  ctx.body = { kind };
});
router.post("/kinds", async (ctx) => {
  const { name } = ctx.body;
  const kind = createKind({ name });
  ctx.body = { kind };
});

router.get("/hooks", async (ctx) => {
  const hooks = await getHooks();
  ctx.body = { hooks };
});
router.post("/hooks", async (ctx) => {
  const { kind_id } = ctx.body;
  const hook = createHook({ kind_id });
  ctx.body = { hook };
});
router.post("/h/:token", async (ctx) => {
  const { token } = ctx.params;
  const hook = await handleHook(token);
  ctx.body = { hook };
});

app.use(router.routes()).use(router.allowedMethods());
export const handler = app.callback();
