import { config as dotenv } from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { createActionByName, getActions } from "./action";

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
