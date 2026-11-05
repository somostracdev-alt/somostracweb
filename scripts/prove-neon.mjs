import { readFileSync } from "fs";
import { neon } from "@neondatabase/serverless";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .flatMap((line) => {
      const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
      return match ? [[match[1], match[2].replace(/^"|"$/g, "")]] : [];
    }),
);

if (!env.DATABASE_URL) {
  console.error("missing DATABASE_URL");
  process.exit(1);
}

const sql = neon(env.DATABASE_URL);
const ping = await sql`SELECT 1 AS ok`;
console.log("ping", ping[0].ok);
const version = await sql`SELECT current_database() AS db`;
console.log("database", version[0].db);
