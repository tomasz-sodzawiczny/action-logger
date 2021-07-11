import { Client } from "pg";
import sql from "sql-template-strings";

const client = new Client();
client.connect();

export { client, sql };
