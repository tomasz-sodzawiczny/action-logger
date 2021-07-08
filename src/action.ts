const { client, sql } = require("./db");

export async function getActions() {
  return client.query(sql`select * from actions;`);
}
