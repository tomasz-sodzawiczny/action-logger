import { config } from "dotenv";
config();

import express from "express";
import helmet from "helmet";
import { createAction, getActions } from "./action";

export const app = express();
app.use(helmet());

app.get("/actions", async (req, res) => {
  const actions = await getActions();
  res.json({ actions });
});
app.post("/actions", async (req, res) => {
  const action = await createAction({ kind: "test" });
  res.json({ action });
});
