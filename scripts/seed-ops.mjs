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

const pieces = JSON.parse(readFileSync("src/ops/seed/gallagro-pieces.json", "utf8"));
const labels = [
  ["account", "Gallagro", "#4f6f52", 0],
  ["account", "Gallatrack", "#6b7c3f", 1],
  ["account", "Grupo Gallagro", "#3f5e4a", 2],
  ["format", "Reel", "#5b6ea8", 0],
  ["format", "Carrusel", "#3d7a8c", 1],
  ["format", "Placa", "#c46a3a", 2],
  ["format", "Historia", "#7a5a8c", 3],
  ["format", "Video", "#4f6f52", 4],
  ["pillar", "Comercial", "#c46a3a", 0],
  ["pillar", "Informativo/trend", "#3d7a8c", 1],
  ["pillar", "RRHH", "#5b6ea8", 2],
  ["pillar", "Repuestos", "#6b7c3f", 3],
  ["pillar", "Valor marca", "#7a5a8c", 4],
  ["status", "Idea", "#7a8176", 0],
  ["status", "En diseño", "#c4a056", 1],
  ["status", "Diseño terminado", "#3d8a7a", 2],
  ["status", "Programada", "#5b6ea8", 3],
  ["status", "Publicada", "#4f6f52", 4],
  ["status", "Esperando material", "#c46a3a", 5],
  ["status", "Material recibido", "#6b7c3f", 6],
  ["status", "No se publicó", "#a45b5b", 7],
  ["status", "No recibimos info", "#8a6a5a", 8],
];

const sql = neon(env.DATABASE_URL);
await sql`CREATE TABLE IF NOT EXISTS ops_clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
)`;
await sql`CREATE TABLE IF NOT EXISTS ops_labels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES ops_clients(id) ON DELETE CASCADE,
  kind text NOT NULL,
  name text NOT NULL,
  color text NOT NULL,
  sort integer NOT NULL DEFAULT 0,
  UNIQUE (client_id, kind, name)
)`;
await sql`CREATE TABLE IF NOT EXISTS ops_pieces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES ops_clients(id) ON DELETE CASCADE,
  publish_on date NOT NULL,
  time_label text NOT NULL DEFAULT '',
  account text NOT NULL DEFAULT '',
  format text NOT NULL DEFAULT '',
  pillar text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT '',
  theme text NOT NULL DEFAULT '',
  material text NOT NULL DEFAULT '',
  copy text NOT NULL DEFAULT '',
  brief text NOT NULL DEFAULT '',
  cta text NOT NULL DEFAULT '',
  owner text NOT NULL DEFAULT '',
  sort integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
)`;
await sql`CREATE INDEX IF NOT EXISTS ops_pieces_client_date_idx ON ops_pieces (client_id, publish_on)`;

const existing = await sql`SELECT id FROM ops_clients WHERE slug = 'gallagro' LIMIT 1`;
let clientId = existing[0]?.id;
if (!clientId) {
  const created = await sql`INSERT INTO ops_clients (slug, name) VALUES ('gallagro', 'Gallagro') RETURNING id`;
  clientId = created[0].id;
}

const labelCount = await sql`SELECT count(*)::int AS n FROM ops_labels WHERE client_id = ${clientId}`;
if (!Number(labelCount[0]?.n)) {
  for (const [kind, name, color, sort] of labels) {
    await sql`
      INSERT INTO ops_labels (client_id, kind, name, color, sort)
      VALUES (${clientId}, ${kind}, ${name}, ${color}, ${sort})
      ON CONFLICT (client_id, kind, name) DO NOTHING
    `;
  }
}

const pieceCount = await sql`SELECT count(*)::int AS n FROM ops_pieces WHERE client_id = ${clientId}`;
if (!Number(pieceCount[0]?.n)) {
  for (const [index, piece] of pieces.entries()) {
    await sql`
      INSERT INTO ops_pieces (
        client_id, publish_on, time_label, account, format, pillar, status,
        theme, material, copy, brief, cta, owner, sort
      ) VALUES (
        ${clientId}, ${piece.publishOn}::date, ${piece.timeLabel}, ${piece.account},
        ${piece.format}, ${piece.pillar}, ${piece.status}, ${piece.theme},
        ${piece.material}, ${piece.copy}, ${piece.brief}, ${piece.cta}, ${piece.owner}, ${index}
      )
    `;
  }
}

const clients = await sql`SELECT slug, name FROM ops_clients`;
const count = await sql`SELECT count(*)::int AS n FROM ops_pieces`;
console.log("clients", JSON.stringify(clients));
console.log("pieces", count[0].n);
