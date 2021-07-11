import { config as dotenv } from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { createAction, getActions } from "./action";

dotenv();

export const app = express();
app.use(helmet());
app.use(morgan("default"));

app.get("/actions", async (req, res) => {
  const actions = await getActions();
  res.json({ actions });
});
app.post("/actions", async (req, res) => {
  const action = await createAction({ kind: "test" });
  res.json({ action });
});
