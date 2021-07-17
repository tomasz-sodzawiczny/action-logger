import { config as dotenv } from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { createActionByName, getActions } from "./action";
import { createHook, getHooks, handleHook } from "./hooks";
import { createKind, getKind, getKinds } from "./kinds";

dotenv();

export const app = express();
app.use(helmet());
app.use(morgan("default"));
app.use(express.json());

app.get("/actions", async (req, res) => {
  const actions = await getActions();
  res.json({ actions });
});
// FW: express cant handle promise rejection
app.post("/actions", async (req, res, next) => {
  const { kind } = req.body;
  if (!kind || typeof kind !== "string") {
    res.sendStatus(400);
    return;
  }
  try {
    const action = await createActionByName(kind);
    res.json({ action });
  } catch (e) {
    next(e);
  }
});

app.get("/kinds", async (req, res) => {
  const kinds = await getKinds();
  res.json({ kinds });
});
app.get("/kinds/:id", async (req, res) => {
  // @ts-ignore TODO
  const kind = await getKind(req.params.id);
  res.json({ kind });
});
app.post("/kinds", async (req, res) => {
  const { name } = req.body;
  const kind = createKind({ name });
  res.json({ kind });
});

app.get("/hooks", async (req, res) => {
  const hooks = await getHooks();
  res.json({ hooks });
});
app.post("/hooks", async (req, res) => {
  const { kind_id } = req.body;
  const hook = createHook({ kind_id });
  res.json({ hook });
});
app.post("/h/:token", async (req, res) => {
  const { token } = req.params;
  const hook = await handleHook(token);
  res.json({ hook });
});
