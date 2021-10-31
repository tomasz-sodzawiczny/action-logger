import { config as dotenv } from "dotenv";
import Koa from "koa";
import Router from "@koa/router";
import helmet from "koa-helmet";
import morgan from "koa-morgan";
import { actionsRouter, createActionByName, getActions } from "./action";
import {
  createHook,
  getHooks,
  handleHook,
  hooksRouter,
  hooksTriggerRouter,
} from "./hooks";
import { createKind, getKind, getKinds, kindsRouter } from "./kinds";
import { Unauthorized } from "http-errors";

dotenv();

const app = new Koa();
const router = new Router();

// List of all api routers. 
const apiRouters = [kindsRouter, actionsRouter, hooksRouter];

router.use("/api", (ctx, next) => {
  const header = ctx.header["authorization"];
  if (header !== `Bearer ${process.env.AUTH_TOKEN}`) {
    throw new Unauthorized();
  }
  return next();
});
apiRouters.forEach((r) => {
  router.use("/api", r.routes());
  router.use("/api", r.allowedMethods());
});

router.use(
  "/h",
  hooksTriggerRouter.routes(),
  hooksTriggerRouter.allowedMethods()
);

app.use(helmet());
app.use(morgan("default"));
app.use(router.routes()).use(router.allowedMethods());

export const handler = app.callback();
