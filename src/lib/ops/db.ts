import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

import { defaultLabels } from "@/lib/ops/labels";
import gallagroPieces from "@/ops/seed/gallagro-pieces.json";

type Sql = NeonQueryFunction<false, false>;

let sql: Sql | null = null;
let ready = false;

export function databaseUrl() {
  return process.env.DATABASE_URL?.trim() || "";
}

export function getSql() {
  const url = databaseUrl();
  if (!url) return null;
  if (!sql) sql = neon(url);
  return sql;
}

export async function ensureOpsSchema() {
  const client = getSql();
  if (!client || ready) return client;
  await client`
    CREATE TABLE IF NOT EXISTS ops_clients (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      slug text UNIQUE NOT NULL,
      name text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await client`
    CREATE TABLE IF NOT EXISTS ops_labels (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      client_id uuid NOT NULL REFERENCES ops_clients(id) ON DELETE CASCADE,
      kind text NOT NULL,
      name text NOT NULL,
      color text NOT NULL,
      sort integer NOT NULL DEFAULT 0,
      UNIQUE (client_id, kind, name)
    )
  `;
  await client`
    CREATE TABLE IF NOT EXISTS ops_pieces (
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
    )
  `;
  await client`CREATE INDEX IF NOT EXISTS ops_pieces_client_date_idx ON ops_pieces (client_id, publish_on)`;
  await seedGallagro(client);
  ready = true;
  return client;
}

async function seedGallagro(client: Sql) {
  const existing = await client`SELECT id FROM ops_clients WHERE slug = 'gallagro' LIMIT 1`;
  let clientId = existing[0]?.id as string | undefined;
  if (!clientId) {
    const created = await client`
      INSERT INTO ops_clients (slug, name) VALUES ('gallagro', 'Gallagro')
      RETURNING id
    `;
    clientId = created[0].id as string;
  }

  const labelCount = await client`SELECT count(*)::int AS n FROM ops_labels WHERE client_id = ${clientId}`;
  if (!Number(labelCount[0]?.n)) {
    for (const label of defaultLabels) {
      await client`
        INSERT INTO ops_labels (client_id, kind, name, color, sort)
        VALUES (${clientId}, ${label.kind}, ${label.name}, ${label.color}, ${label.sort})
        ON CONFLICT (client_id, kind, name) DO NOTHING
      `;
    }
  }

  const pieceCount = await client`SELECT count(*)::int AS n FROM ops_pieces WHERE client_id = ${clientId}`;
  if (Number(pieceCount[0]?.n)) return;

  for (const [index, piece] of gallagroPieces.entries()) {
    await client`
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
