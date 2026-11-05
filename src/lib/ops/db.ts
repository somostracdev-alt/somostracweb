import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

import { defaultLabels } from "@/lib/ops/labels";
import { seedGallagroPlan } from "@/lib/ops/seed-plan";
import gallagroPieces from "@/ops/seed/gallagro-pieces.json";

type Sql = NeonQueryFunction<false, false>;

let sql: Sql | null = null;
let ready = false;

export function databaseUrl() {
  let raw = process.env.DATABASE_URL?.trim() || "";
  if (
    (raw.startsWith('"') && raw.endsWith('"')) ||
    (raw.startsWith("'") && raw.endsWith("'"))
  ) {
    raw = raw.slice(1, -1).trim();
  }
  if (raw.toLowerCase().startsWith("psql ")) {
    raw = raw.slice(5).trim();
    if (
      (raw.startsWith('"') && raw.endsWith('"')) ||
      (raw.startsWith("'") && raw.endsWith("'"))
    ) {
      raw = raw.slice(1, -1).trim();
    }
  }
  return raw.replace(/\s+/g, "");
}

export function describeDatabaseUrl(url: string) {
  try {
    const parsed = new URL(url);
    const scheme = parsed.protocol.replace(/:$/, "");
    const user = decodeURIComponent(parsed.username || "");
    const host = parsed.hostname;
    const database = decodeURIComponent(parsed.pathname.replace(/^\//, "").replace(/\/$/, ""));
    const ok =
      (scheme === "postgres" || scheme === "postgresql") &&
      Boolean(user) &&
      Boolean(host) &&
      host !== "-" &&
      Boolean(database);
    return { ok, scheme, user, host, database, pooled: host.includes("-pooler") };
  } catch {
    return { ok: false, scheme: "", user: "", host: "", database: "", pooled: false };
  }
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
  await client`
    CREATE TABLE IF NOT EXISTS ops_plans (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      client_id uuid NOT NULL REFERENCES ops_clients(id) ON DELETE CASCADE,
      name text NOT NULL,
      platform text NOT NULL DEFAULT '',
      account_ref text NOT NULL DEFAULT '',
      destination text NOT NULL DEFAULT '',
      channels text NOT NULL DEFAULT '',
      created_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await client`CREATE INDEX IF NOT EXISTS ops_plans_client_idx ON ops_plans (client_id)`;
  await client`
    CREATE TABLE IF NOT EXISTS ops_plan_months (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      plan_id uuid NOT NULL REFERENCES ops_plans(id) ON DELETE CASCADE,
      month date NOT NULL,
      cap_amount integer NOT NULL DEFAULT 0,
      UNIQUE (plan_id, month)
    )
  `;
  await client`
    CREATE TABLE IF NOT EXISTS ops_plan_notes (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      plan_id uuid NOT NULL REFERENCES ops_plans(id) ON DELETE CASCADE,
      kind text NOT NULL CHECK (kind IN ('how', 'pending')),
      body text NOT NULL,
      done boolean NOT NULL DEFAULT false,
      sort integer NOT NULL DEFAULT 0
    )
  `;
  await client`CREATE INDEX IF NOT EXISTS ops_plan_notes_plan_idx ON ops_plan_notes (plan_id)`;
  await client`
    CREATE TABLE IF NOT EXISTS ops_campaigns (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      plan_id uuid NOT NULL REFERENCES ops_plans(id) ON DELETE CASCADE,
      name text NOT NULL,
      label text NOT NULL DEFAULT '',
      sort integer NOT NULL DEFAULT 0,
      UNIQUE (plan_id, name)
    )
  `;
  await client`
    CREATE TABLE IF NOT EXISTS ops_audiences (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      campaign_id uuid NOT NULL UNIQUE REFERENCES ops_campaigns(id) ON DELETE CASCADE,
      zone text NOT NULL DEFAULT '',
      audience text NOT NULL DEFAULT '',
      exclude_note text NOT NULL DEFAULT ''
    )
  `;
  await client`
    CREATE TABLE IF NOT EXISTS ops_ad_sets (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      campaign_id uuid NOT NULL REFERENCES ops_campaigns(id) ON DELETE CASCADE,
      month date NOT NULL,
      name text NOT NULL,
      kind text NOT NULL CHECK (kind IN ('always_on', 'special', 'off')),
      window_label text NOT NULL DEFAULT '',
      message text NOT NULL DEFAULT '',
      ads_label text NOT NULL DEFAULT '',
      brands text NOT NULL DEFAULT '',
      zone_note text NOT NULL DEFAULT '',
      whatsapp text NOT NULL DEFAULT '',
      daily_budget integer,
      days integer NOT NULL DEFAULT 0 CHECK (days >= 0),
      sort integer NOT NULL DEFAULT 0,
      updated_at timestamptz NOT NULL DEFAULT now(),
      CHECK (daily_budget IS NULL OR daily_budget >= 0)
    )
  `;
  await client`CREATE INDEX IF NOT EXISTS ops_ad_sets_campaign_idx ON ops_ad_sets (campaign_id, month)`;
  await client`
    CREATE TABLE IF NOT EXISTS ops_ads (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      ad_set_id uuid NOT NULL REFERENCES ops_ad_sets(id) ON DELETE CASCADE,
      name text NOT NULL DEFAULT '',
      angle text NOT NULL DEFAULT '',
      body text NOT NULL DEFAULT '',
      prefilled text NOT NULL DEFAULT '',
      sort integer NOT NULL DEFAULT 0,
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;
  await client`CREATE INDEX IF NOT EXISTS ops_ads_set_idx ON ops_ads (ad_set_id)`;
  await client`
    CREATE TABLE IF NOT EXISTS ops_creatives (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      plan_id uuid NOT NULL REFERENCES ops_plans(id) ON DELETE CASCADE,
      due_on date,
      due_label text NOT NULL DEFAULT '',
      campaign_label text NOT NULL DEFAULT '',
      ad_set_name text NOT NULL DEFAULT '',
      ad_name text NOT NULL DEFAULT '',
      image_feed integer NOT NULL DEFAULT 0,
      image_story integer NOT NULL DEFAULT 0,
      video_story integer NOT NULL DEFAULT 0,
      video_feed integer NOT NULL DEFAULT 0,
      copy_text text NOT NULL DEFAULT '',
      material text NOT NULL DEFAULT '',
      deliver_label text NOT NULL DEFAULT '',
      sort integer NOT NULL DEFAULT 0
    )
  `;
  await client`CREATE INDEX IF NOT EXISTS ops_creatives_plan_idx ON ops_creatives (plan_id)`;
  await seedGallagro(client);
  await seedGallagroPlan(client);
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
