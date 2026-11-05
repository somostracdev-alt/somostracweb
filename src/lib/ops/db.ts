import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

import { defaultLabels } from "@/lib/ops/labels";
import { seedGallagroPlan } from "@/lib/ops/seed-plan";
import gallagroPieces from "@/ops/seed/gallagro-pieces.json";
import gallagroPlan from "@/ops/seed/gallagro-plan.json";

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
  await migrateCampaignMonths(client);
  ready = true;
  return client;
}

function isoDate(value: unknown) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value ?? "").slice(0, 10);
}

async function migrateCampaignMonths(client: Sql) {
  await client`ALTER TABLE ops_campaigns ADD COLUMN IF NOT EXISTS month date`;
  await client`ALTER TABLE ops_campaigns ADD COLUMN IF NOT EXISTS monthly boolean NOT NULL DEFAULT false`;
  await client`ALTER TABLE ops_campaigns ADD COLUMN IF NOT EXISTS series_id uuid`;
  await client`ALTER TABLE ops_campaigns DROP CONSTRAINT IF EXISTS ops_campaigns_plan_id_name_key`;

  const pending = await client`SELECT id, plan_id FROM ops_campaigns WHERE month IS NULL`;
  for (const row of pending) {
    const id = String(row.id);
    const planId = String(row.plan_id);
    const months = await client`
      SELECT month FROM (
        SELECT month FROM ops_plan_months WHERE plan_id = ${planId}
        UNION
        SELECT month FROM ops_ad_sets WHERE campaign_id = ${id}
      ) months
      ORDER BY month
    `;
    const list = months.map((item) => isoDate(item.month)).filter((month) => /^\d{4}-\d{2}-\d{2}$/.test(month));
    if (!list.length) {
      const now = new Date();
      list.push(`${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-01`);
    }
    const series = await client`SELECT gen_random_uuid() AS id`;
    const seriesId = String(series[0].id);
    const [first, ...rest] = list;
    await client`
      UPDATE ops_campaigns
      SET month = ${first}::date, monthly = true, series_id = ${seriesId}
      WHERE id = ${id}
    `;
    const audience = await client`
      SELECT zone, audience, exclude_note FROM ops_audiences WHERE campaign_id = ${id}
    `;
    for (const month of rest) {
      const existing = await client`
        SELECT id FROM ops_campaigns
        WHERE plan_id = ${planId}
          AND name = (SELECT name FROM ops_campaigns WHERE id = ${id})
          AND month = ${month}::date
          AND id <> ${id}
        LIMIT 1
      `;
      let copyId = existing[0] ? String(existing[0].id) : "";
      if (!copyId) {
        const created = await client`
          INSERT INTO ops_campaigns (plan_id, name, label, sort, month, monthly, series_id)
          SELECT plan_id, name, label, sort, ${month}::date, true, ${seriesId}::uuid
          FROM ops_campaigns
          WHERE id = ${id}
          RETURNING id
        `;
        copyId = String(created[0].id);
        if (audience[0]) {
          await client`
            INSERT INTO ops_audiences (campaign_id, zone, audience, exclude_note)
            VALUES (${copyId}, ${String(audience[0].zone ?? "")}, ${String(audience[0].audience ?? "")}, ${String(audience[0].exclude_note ?? "")})
          `;
        }
      }
      await client`
        UPDATE ops_ad_sets
        SET campaign_id = ${copyId}
        WHERE campaign_id = ${id} AND month = ${month}::date
      `;
    }
  }

  const duplicated = await client`
    SELECT plan_id, month, name
    FROM ops_campaigns
    WHERE month IS NOT NULL
    GROUP BY plan_id, month, name
    HAVING count(*) > 1
  `;
  for (const group of duplicated) {
    const copies = await client`
      SELECT c.id, count(s.id)::int AS sets
      FROM ops_campaigns c
      LEFT JOIN ops_ad_sets s ON s.campaign_id = c.id
      WHERE c.plan_id = ${String(group.plan_id)}
        AND c.month = ${group.month}
        AND c.name = ${String(group.name)}
      GROUP BY c.id
      ORDER BY count(s.id) DESC, c.id
    `;
    const keeper = String(copies[0].id);
    for (const extra of copies.slice(1)) {
      const dup = String(extra.id);
      await client`UPDATE ops_ad_sets SET campaign_id = ${keeper} WHERE campaign_id = ${dup}`;
      const keeperAudience = await client`SELECT id FROM ops_audiences WHERE campaign_id = ${keeper} LIMIT 1`;
      if (keeperAudience[0]) await client`DELETE FROM ops_audiences WHERE campaign_id = ${dup}`;
      else await client`UPDATE ops_audiences SET campaign_id = ${keeper} WHERE campaign_id = ${dup}`;
      await client`DELETE FROM ops_campaigns WHERE id = ${dup}`;
    }
    const series = await client`
      SELECT series_id FROM ops_campaigns
      WHERE plan_id = ${String(group.plan_id)} AND name = ${String(group.name)} AND series_id IS NOT NULL
      ORDER BY month
      LIMIT 1
    `;
    if (series[0]?.series_id) {
      await client`
        UPDATE ops_campaigns
        SET series_id = ${String(series[0].series_id)}::uuid
        WHERE plan_id = ${String(group.plan_id)} AND name = ${String(group.name)}
      `;
    }
  }

  await client`
    CREATE UNIQUE INDEX IF NOT EXISTS ops_campaigns_plan_month_name_idx
    ON ops_campaigns (plan_id, month, name)
  `;
  await client`CREATE INDEX IF NOT EXISTS ops_campaigns_series_idx ON ops_campaigns (series_id, month)`;
  await client`ALTER TABLE ops_campaigns ALTER COLUMN month SET NOT NULL`;
  await client`ALTER TABLE ops_campaigns ALTER COLUMN series_id SET NOT NULL`;
  await client`ALTER TABLE ops_campaigns ADD COLUMN IF NOT EXISTS span_from date`;
  await client`ALTER TABLE ops_campaigns ADD COLUMN IF NOT EXISTS span_to date`;
  await client`
    UPDATE ops_campaigns AS campaign
    SET span_from = bounds.span_from, span_to = bounds.span_to
    FROM (
      SELECT series_id, min(month) AS span_from, max(month) AS span_to
      FROM ops_campaigns
      GROUP BY series_id
    ) AS bounds
    WHERE campaign.series_id = bounds.series_id
      AND campaign.span_from IS NULL
  `;
  await shareAudienceBySeries(client);
}

async function separateSharedSeries(client: Sql) {
  const shared = await client`
    SELECT series_id FROM ops_campaigns
    GROUP BY series_id
    HAVING count(DISTINCT name) > 1
  `;
  for (const row of shared) {
    const seriesId = String(row.series_id);
    const names = await client`
      SELECT DISTINCT name FROM ops_campaigns WHERE series_id = ${seriesId}::uuid ORDER BY name
    `;
    const audience = await client`SELECT zone FROM ops_audiences WHERE series_id = ${seriesId}::uuid LIMIT 1`;
    const zone = String(audience[0]?.zone ?? "");
    const owner = gallagroPlan.campaigns.find((campaign) => campaign.audience?.zone === zone)?.name ?? String(names[0]?.name ?? "");
    for (const nameRow of names) {
      const name = String(nameRow.name);
      if (name === owner) continue;
      const fresh = await client`SELECT gen_random_uuid() AS id`;
      await client`
        UPDATE ops_campaigns
        SET series_id = ${String(fresh[0].id)}::uuid
        WHERE series_id = ${seriesId}::uuid AND name = ${name}
      `;
    }
  }
}

async function restoreMissingAudiences(client: Sql) {
  const missing = await client`
    SELECT campaign.series_id, campaign.name
    FROM ops_campaigns AS campaign
    LEFT JOIN ops_audiences AS audience ON audience.series_id = campaign.series_id
    WHERE audience.id IS NULL
    GROUP BY campaign.series_id, campaign.name
  `;
  for (const row of missing) {
    const source = gallagroPlan.campaigns.find((campaign) => campaign.name === String(row.name));
    if (!source?.audience) continue;
    await client`
      INSERT INTO ops_audiences (series_id, zone, audience, exclude_note)
      VALUES (${String(row.series_id)}::uuid, ${source.audience.zone}, ${source.audience.who}, ${source.audience.exclude})
      ON CONFLICT (series_id) DO NOTHING
    `;
  }
}

async function shareAudienceBySeries(client: Sql) {
  await client`ALTER TABLE ops_audiences ADD COLUMN IF NOT EXISTS series_id uuid`;
  await separateSharedSeries(client);
  await client`
    UPDATE ops_audiences AS audience
    SET series_id = campaign.series_id
    FROM ops_campaigns AS campaign
    WHERE audience.campaign_id = campaign.id
      AND audience.series_id IS NULL
  `;
  const duplicated = await client`
    SELECT series_id FROM ops_audiences
    WHERE series_id IS NOT NULL
    GROUP BY series_id
    HAVING count(*) > 1
  `;
  for (const row of duplicated) {
    const seriesId = String(row.series_id);
    const keeper = await client`
      SELECT audience.id
      FROM ops_audiences AS audience
      JOIN ops_campaigns AS campaign ON campaign.id = audience.campaign_id
      WHERE audience.series_id = ${seriesId}::uuid
      ORDER BY campaign.month, audience.id
      LIMIT 1
    `;
    if (!keeper[0]) continue;
    await client`
      DELETE FROM ops_audiences
      WHERE series_id = ${seriesId}::uuid AND id <> ${String(keeper[0].id)}
    `;
  }
  await client`ALTER TABLE ops_audiences DROP CONSTRAINT IF EXISTS ops_audiences_campaign_id_fkey`;
  await client`ALTER TABLE ops_audiences DROP CONSTRAINT IF EXISTS ops_audiences_campaign_id_key`;
  await client`ALTER TABLE ops_audiences ALTER COLUMN campaign_id DROP NOT NULL`;
  await client`CREATE UNIQUE INDEX IF NOT EXISTS ops_audiences_series_idx ON ops_audiences (series_id)`;
  await restoreMissingAudiences(client);
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
