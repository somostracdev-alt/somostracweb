import { ensureOpsSchema } from "@/lib/ops/db";

export type PlanAd = {
  id: string;
  name: string;
  angle: string;
  body: string;
  prefilled: string;
};

export type PlanAdSet = {
  id: string;
  campaignId: string;
  month: string;
  name: string;
  kind: "always_on" | "special" | "off";
  windowLabel: string;
  message: string;
  adsLabel: string;
  brands: string;
  zoneNote: string;
  whatsapp: string;
  dailyBudget: number | null;
  days: number;
  ads: PlanAd[];
};

export type PlanCampaign = {
  id: string;
  name: string;
  label: string;
  audience: { zone: string; who: string; exclude: string } | null;
  sets: PlanAdSet[];
};

export type PlanCreative = {
  id: string;
  dueOn: string;
  dueLabel: string;
  campaignLabel: string;
  adSetName: string;
  adName: string;
  imageFeed: number;
  imageStory: number;
  videoStory: number;
  videoFeed: number;
  copy: string;
  material: string;
  deliverLabel: string;
};

export type PlanNote = {
  id: string;
  kind: "how" | "pending";
  body: string;
  done: boolean;
  sort: number;
};

export type PlanMonth = {
  month: string;
  cap: number;
};

export type OpsPlan = {
  id: string;
  name: string;
  platform: string;
  accountRef: string;
  destination: string;
  channels: string;
  months: PlanMonth[];
  notes: PlanNote[];
  campaigns: PlanCampaign[];
  creatives: PlanCreative[];
};

function asDate(value: unknown) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value ?? "").slice(0, 10);
}

function asMoney(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  return Number(value);
}

export async function getOpsPlan(clientId: string): Promise<OpsPlan | null> {
  const sql = await ensureOpsSchema();
  if (!sql) return null;
  const plans = await sql`
    SELECT id, name, platform, account_ref, destination, channels
    FROM ops_plans
    WHERE client_id = ${clientId}
    ORDER BY created_at
    LIMIT 1
  `;
  const plan = plans[0];
  if (!plan) return null;
  const planId = String(plan.id);

  const [months, notes, campaigns, creatives, audiences, sets, ads] = await Promise.all([
    sql`SELECT month, cap_amount FROM ops_plan_months WHERE plan_id = ${planId} ORDER BY month`,
    sql`SELECT id, kind, body, done, sort FROM ops_plan_notes WHERE plan_id = ${planId} ORDER BY kind, sort`,
    sql`SELECT id, name, label, sort FROM ops_campaigns WHERE plan_id = ${planId} ORDER BY sort, name`,
    sql`
      SELECT id, due_on, due_label, campaign_label, ad_set_name, ad_name,
        image_feed, image_story, video_story, video_feed, copy_text, material, deliver_label
      FROM ops_creatives
      WHERE plan_id = ${planId}
      ORDER BY sort
    `,
    sql`
      SELECT campaign_id, zone, audience, exclude_note
      FROM ops_audiences
      WHERE campaign_id IN (SELECT id FROM ops_campaigns WHERE plan_id = ${planId})
    `,
    sql`
      SELECT id, campaign_id, month, name, kind, window_label, message, ads_label,
        brands, zone_note, whatsapp, daily_budget, days, sort
      FROM ops_ad_sets
      WHERE campaign_id IN (SELECT id FROM ops_campaigns WHERE plan_id = ${planId})
      ORDER BY month, sort, name
    `,
    sql`
      SELECT id, ad_set_id, name, angle, body, prefilled, sort
      FROM ops_ads
      WHERE ad_set_id IN (
        SELECT id FROM ops_ad_sets
        WHERE campaign_id IN (SELECT id FROM ops_campaigns WHERE plan_id = ${planId})
      )
      ORDER BY sort, name
    `,
  ]);

  const adsBySet = new Map<string, PlanAd[]>();
  for (const row of ads) {
    const setId = String(row.ad_set_id);
    const list = adsBySet.get(setId) ?? [];
    list.push({
      id: String(row.id),
      name: String(row.name ?? ""),
      angle: String(row.angle ?? ""),
      body: String(row.body ?? ""),
      prefilled: String(row.prefilled ?? ""),
    });
    adsBySet.set(setId, list);
  }

  const setsByCampaign = new Map<string, PlanAdSet[]>();
  for (const row of sets) {
    const campaignId = String(row.campaign_id);
    const list = setsByCampaign.get(campaignId) ?? [];
    const kind = String(row.kind);
    list.push({
      id: String(row.id),
      campaignId,
      month: asDate(row.month),
      name: String(row.name ?? ""),
      kind: kind === "special" || kind === "off" ? kind : "always_on",
      windowLabel: String(row.window_label ?? ""),
      message: String(row.message ?? ""),
      adsLabel: String(row.ads_label ?? ""),
      brands: String(row.brands ?? ""),
      zoneNote: String(row.zone_note ?? ""),
      whatsapp: String(row.whatsapp ?? ""),
      dailyBudget: asMoney(row.daily_budget),
      days: Number(row.days ?? 0),
      ads: adsBySet.get(String(row.id)) ?? [],
    });
    setsByCampaign.set(campaignId, list);
  }

  const audienceByCampaign = new Map(
    audiences.map((row) => [
      String(row.campaign_id),
      {
        zone: String(row.zone ?? ""),
        who: String(row.audience ?? ""),
        exclude: String(row.exclude_note ?? ""),
      },
    ]),
  );

  return {
    id: planId,
    name: String(plan.name ?? ""),
    platform: String(plan.platform ?? ""),
    accountRef: String(plan.account_ref ?? ""),
    destination: String(plan.destination ?? ""),
    channels: String(plan.channels ?? ""),
    months: months.map((row) => ({ month: asDate(row.month), cap: Number(row.cap_amount ?? 0) })),
    notes: notes.map((row) => ({
      id: String(row.id),
      kind: row.kind === "pending" ? "pending" : "how",
      body: String(row.body ?? ""),
      done: Boolean(row.done),
      sort: Number(row.sort ?? 0),
    })),
    campaigns: campaigns.map((row) => ({
      id: String(row.id),
      name: String(row.name ?? ""),
      label: String(row.label ?? ""),
      audience: audienceByCampaign.get(String(row.id)) ?? null,
      sets: setsByCampaign.get(String(row.id)) ?? [],
    })),
    creatives: creatives.map((row) => ({
      id: String(row.id),
      dueOn: asDate(row.due_on),
      dueLabel: String(row.due_label ?? ""),
      campaignLabel: String(row.campaign_label ?? ""),
      adSetName: String(row.ad_set_name ?? ""),
      adName: String(row.ad_name ?? ""),
      imageFeed: Number(row.image_feed ?? 0),
      imageStory: Number(row.image_story ?? 0),
      videoStory: Number(row.video_story ?? 0),
      videoFeed: Number(row.video_feed ?? 0),
      copy: String(row.copy_text ?? ""),
      material: String(row.material ?? ""),
      deliverLabel: String(row.deliver_label ?? ""),
    })),
  };
}

const kinds = new Set(["always_on", "special", "off"]);

function assertBudget(input: { kind: string; dailyBudget: number | null; days: number }) {
  if (!kinds.has(input.kind)) throw new Error("El tipo de conjunto no es válido.");
  if (!Number.isInteger(input.days) || input.days < 0 || input.days > 31) {
    throw new Error("Los días tienen que ser un número entre 0 y 31.");
  }
  if (input.dailyBudget !== null && (!Number.isInteger(input.dailyBudget) || input.dailyBudget < 0)) {
    throw new Error("El presupuesto por día tiene que ser un número.");
  }
}

async function nextSort(sql: NonNullable<Awaited<ReturnType<typeof ensureOpsSchema>>>, table: "ops_campaigns" | "ops_ad_sets" | "ops_ads", id: string) {
  const rows =
    table === "ops_campaigns"
      ? await sql`SELECT coalesce(max(sort), -1) + 1 AS sort FROM ops_campaigns WHERE plan_id = ${id}`
      : table === "ops_ad_sets"
        ? await sql`SELECT coalesce(max(sort), -1) + 1 AS sort FROM ops_ad_sets WHERE campaign_id = ${id}`
        : await sql`SELECT coalesce(max(sort), -1) + 1 AS sort FROM ops_ads WHERE ad_set_id = ${id}`;
  return Number(rows[0]?.sort ?? 0);
}

export async function createOpsCampaign(clientId: string, month: string, input: { name: string; label: string }) {
  const sql = await ensureOpsSchema();
  if (!sql) throw new Error("Falta DATABASE_URL de Neon.");
  const label = input.label.trim();
  const name = input.name.trim() || label;
  if (!label) throw new Error("Falta el nombre de la campaña.");

  const existing = await sql`SELECT id FROM ops_plans WHERE client_id = ${clientId} ORDER BY created_at LIMIT 1`;
  let planId = existing[0] ? String(existing[0].id) : "";
  if (!planId) {
    const created = await sql`
      INSERT INTO ops_plans (client_id, name) VALUES (${clientId}, ${"Pauta"})
      RETURNING id
    `;
    planId = String(created[0].id);
    await sql`
      INSERT INTO ops_plan_months (plan_id, month, cap_amount)
      VALUES (${planId}, ${month}::date, 0)
    `;
  }

  const sort = await nextSort(sql, "ops_campaigns", planId);
  try {
    await sql`
      INSERT INTO ops_campaigns (plan_id, name, label, sort)
      VALUES (${planId}, ${name}, ${label}, ${sort})
    `;
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.toLowerCase().includes("unique") || message.includes("ops_campaigns")) {
      throw new Error("Ya existe una campaña con ese nombre.");
    }
    throw error;
  }
}

export async function updateOpsCampaign(id: string, input: { name: string; label: string }) {
  const sql = await ensureOpsSchema();
  if (!sql) throw new Error("Falta DATABASE_URL de Neon.");
  const label = input.label.trim();
  const name = input.name.trim() || label;
  if (!label) throw new Error("Falta el nombre de la campaña.");
  const rows = await sql`
    UPDATE ops_campaigns SET name = ${name}, label = ${label}
    WHERE id = ${id}
    RETURNING id
  `;
  if (!rows[0]) throw new Error("No se encontró la campaña.");
}

export async function deleteOpsCampaign(id: string) {
  const sql = await ensureOpsSchema();
  if (!sql) throw new Error("Falta DATABASE_URL de Neon.");
  await sql`DELETE FROM ops_campaigns WHERE id = ${id}`;
}

type AdSetInput = {
  name: string;
  kind: string;
  windowLabel: string;
  message: string;
  adsLabel: string;
  brands: string;
  zoneNote: string;
  whatsapp: string;
  dailyBudget: number | null;
  days: number;
};

export async function createOpsAdSet(campaignId: string, month: string, input: AdSetInput) {
  const sql = await ensureOpsSchema();
  if (!sql) throw new Error("Falta DATABASE_URL de Neon.");
  if (!input.name.trim()) throw new Error("Falta el nombre del conjunto.");
  assertBudget(input);
  const sort = await nextSort(sql, "ops_ad_sets", campaignId);
  await sql`
    INSERT INTO ops_ad_sets (
      campaign_id, month, name, kind, window_label, message, ads_label,
      brands, zone_note, whatsapp, daily_budget, days, sort
    ) VALUES (
      ${campaignId}, ${month}::date, ${input.name.trim()}, ${input.kind}, ${input.windowLabel},
      ${input.message}, ${input.adsLabel}, ${input.brands}, ${input.zoneNote}, ${input.whatsapp},
      ${input.dailyBudget}, ${input.days}, ${sort}
    )
  `;
}

export async function updateOpsAdSet(id: string, input: AdSetInput) {
  const sql = await ensureOpsSchema();
  if (!sql) throw new Error("Falta DATABASE_URL de Neon.");
  if (!input.name.trim()) throw new Error("Falta el nombre del conjunto.");
  assertBudget(input);
  const rows = await sql`
    UPDATE ops_ad_sets SET
      name = ${input.name.trim()},
      kind = ${input.kind},
      window_label = ${input.windowLabel},
      message = ${input.message},
      ads_label = ${input.adsLabel},
      brands = ${input.brands},
      zone_note = ${input.zoneNote},
      whatsapp = ${input.whatsapp},
      daily_budget = ${input.dailyBudget},
      days = ${input.days},
      updated_at = now()
    WHERE id = ${id}
    RETURNING id
  `;
  if (!rows[0]) throw new Error("No se encontró el conjunto.");
}

export async function deleteOpsAdSet(id: string) {
  const sql = await ensureOpsSchema();
  if (!sql) throw new Error("Falta DATABASE_URL de Neon.");
  await sql`DELETE FROM ops_ad_sets WHERE id = ${id}`;
}

type AdInput = { name: string; angle: string; body: string; prefilled: string };

export async function createOpsAd(setId: string, input: AdInput) {
  const sql = await ensureOpsSchema();
  if (!sql) throw new Error("Falta DATABASE_URL de Neon.");
  if (!input.name.trim()) throw new Error("Falta el nombre del anuncio.");
  const sort = await nextSort(sql, "ops_ads", setId);
  await sql`
    INSERT INTO ops_ads (ad_set_id, name, angle, body, prefilled, sort)
    VALUES (${setId}, ${input.name.trim()}, ${input.angle}, ${input.body}, ${input.prefilled}, ${sort})
  `;
}

export async function updateOpsAd(id: string, input: AdInput) {
  const sql = await ensureOpsSchema();
  if (!sql) throw new Error("Falta DATABASE_URL de Neon.");
  if (!input.name.trim()) throw new Error("Falta el nombre del anuncio.");
  const rows = await sql`
    UPDATE ops_ads SET
      name = ${input.name.trim()},
      angle = ${input.angle},
      body = ${input.body},
      prefilled = ${input.prefilled},
      updated_at = now()
    WHERE id = ${id}
    RETURNING id
  `;
  if (!rows[0]) throw new Error("No se encontró el anuncio.");
}

export async function deleteOpsAd(id: string) {
  const sql = await ensureOpsSchema();
  if (!sql) throw new Error("Falta DATABASE_URL de Neon.");
  await sql`DELETE FROM ops_ads WHERE id = ${id}`;
}

function pieceCount(value: number) {
  if (!Number.isInteger(value) || value < 0 || value > 99) {
    throw new Error("Las piezas tienen que ser un número.");
  }
  return value;
}

export async function updateOpsCreative(
  id: string,
  input: {
    dueOn: string | null;
    dueLabel: string;
    campaignLabel: string;
    adSetName: string;
    adName: string;
    imageFeed: number;
    imageStory: number;
    videoStory: number;
    videoFeed: number;
    copy: string;
    material: string;
    deliverLabel: string;
  },
) {
  const sql = await ensureOpsSchema();
  if (!sql) throw new Error("Falta DATABASE_URL de Neon.");
  if (!input.adName.trim()) throw new Error("Falta el nombre del anuncio.");
  const rows = await sql`
    UPDATE ops_creatives SET
      due_on = ${input.dueOn}::date,
      due_label = ${input.dueLabel},
      campaign_label = ${input.campaignLabel},
      ad_set_name = ${input.adSetName},
      ad_name = ${input.adName.trim()},
      image_feed = ${pieceCount(input.imageFeed)},
      image_story = ${pieceCount(input.imageStory)},
      video_story = ${pieceCount(input.videoStory)},
      video_feed = ${pieceCount(input.videoFeed)},
      copy_text = ${input.copy},
      material = ${input.material},
      deliver_label = ${input.deliverLabel}
    WHERE id = ${id}
    RETURNING id
  `;
  if (!rows[0]) throw new Error("No se encontró el creativo.");
}

export async function saveOpsAudience(campaignId: string, input: { zone: string; who: string; exclude: string }) {
  const sql = await ensureOpsSchema();
  if (!sql) throw new Error("Falta DATABASE_URL de Neon.");
  await sql`
    INSERT INTO ops_audiences (campaign_id, zone, audience, exclude_note)
    VALUES (${campaignId}, ${input.zone}, ${input.who}, ${input.exclude})
    ON CONFLICT (campaign_id) DO UPDATE SET
      zone = EXCLUDED.zone,
      audience = EXCLUDED.audience,
      exclude_note = EXCLUDED.exclude_note
  `;
}

export async function setOpsPlanNoteDone(id: string, done: boolean) {
  const sql = await ensureOpsSchema();
  if (!sql) throw new Error("Falta DATABASE_URL de Neon.");
  const rows = await sql`
    UPDATE ops_plan_notes SET done = ${done}
    WHERE id = ${id} AND kind = 'pending'
    RETURNING id
  `;
  if (!rows[0]) throw new Error("No se encontró el pendiente.");
}
