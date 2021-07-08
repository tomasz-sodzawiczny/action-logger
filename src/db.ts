const { Client } = require("pg");
const sql = require("sql-template-strings");

const client = new Client();
client.connect();
let connectionPromise: Promise<void> | null = null;

export { client, sql };
