const dotenv = require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const { getActions } = require("./action");

export const app = express();
app.use(helmet());
app.get("/actions", async () => {
  const dupka = await getActions();
  console.log(dupka);
});
