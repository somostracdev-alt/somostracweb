import type { NeonQueryFunction } from "@neondatabase/serverless";

import { defaultLabels } from "@/lib/ops/labels";
import gallatrackPieces from "@/ops/seed/gallatrack-pieces.json";
import gallatrackPlan from "@/ops/seed/gallatrack-plan.json";

type Sql = NeonQueryFunction<false, false>;

export async function seedGallatrack(sql: Sql) {
  const existing = await sql`SELECT id FROM ops_clients WHERE slug = 'gallatrack' LIMIT 1`;
  let clientId = existing[0]?.id as string | undefined;
  if (!clientId) {
    const created = await sql`
      INSERT INTO ops_clients (slug, name) VALUES ('gallatrack', 'Gallatrack')
      RETURNING id
    `;
    clientId = created[0].id as string;
  }

  const labelCount = await sql`SELECT count(*)::int AS n FROM ops_labels WHERE client_id = ${clientId}`;
  if (!Number(labelCount[0]?.n)) {
    for (const label of defaultLabels) {
      await sql`
        INSERT INTO ops_labels (client_id, kind, name, color, sort)
        VALUES (${clientId}, ${label.kind}, ${label.name}, ${label.color}, ${label.sort})
        ON CONFLICT (client_id, kind, name) DO NOTHING
      `;
    }
  }

  await seedGallatrackPlan(sql, clientId);

  const pieceCount = await sql`SELECT count(*)::int AS n FROM ops_pieces WHERE client_id = ${clientId}`;
  if (Number(pieceCount[0]?.n)) return;

  for (const [index, piece] of gallatrackPieces.entries()) {
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

async function seedGallatrackPlan(sql: Sql, clientId: string) {
  const existing = await sql`SELECT id FROM ops_plans WHERE client_id = ${clientId} ORDER BY created_at LIMIT 1`;
  let planId = existing[0] ? String(existing[0].id) : "";
  let createdPlan = false;
  if (planId) {
    const campaigns = await sql`SELECT count(*)::int AS n FROM ops_campaigns WHERE plan_id = ${planId}`;
    if (Number(campaigns[0]?.n)) return;
    await sql`
      UPDATE ops_plans
      SET name = ${gallatrackPlan.name},
          platform = ${gallatrackPlan.platform},
          account_ref = ${gallatrackPlan.accountRef},
          destination = ${gallatrackPlan.destination},
          channels = ${gallatrackPlan.channels}
      WHERE id = ${planId}
    `;
  } else {
    const created = await sql`
      INSERT INTO ops_plans (client_id, name, platform, account_ref, destination, channels)
      VALUES (
        ${clientId},
        ${gallatrackPlan.name},
        ${gallatrackPlan.platform},
        ${gallatrackPlan.accountRef},
        ${gallatrackPlan.destination},
        ${gallatrackPlan.channels}
      )
      RETURNING id
    `;
    planId = String(created[0].id);
    createdPlan = true;
  }
  const seriesIds: string[] = [];

  try {
    for (const month of gallatrackPlan.months) {
      await sql`
        INSERT INTO ops_plan_months (plan_id, month, cap_amount)
        VALUES (${planId}, ${month.month}::date, ${month.cap})
      `;
    }
    for (const [index, body] of gallatrackPlan.how.entries()) {
      await sql`
        INSERT INTO ops_plan_notes (plan_id, kind, body, sort)
        VALUES (${planId}, 'how', ${body}, ${index})
      `;
    }
    for (const [index, body] of gallatrackPlan.pending.entries()) {
      await sql`
        INSERT INTO ops_plan_notes (plan_id, kind, body, sort)
        VALUES (${planId}, 'pending', ${body}, ${index})
      `;
    }

    for (const [campaignIndex, campaign] of gallatrackPlan.campaigns.entries()) {
      const series = await sql`SELECT gen_random_uuid() AS id`;
      const seriesId = String(series[0].id);
      seriesIds.push(seriesId);
      const months = [...new Set(campaign.sets.map((set) => set.month))].sort();
      const spanFrom = months[0];
      const spanTo = months[months.length - 1];
      const monthly = months.length > 1;
      let firstCampaignId = "";

      for (const month of months) {
        const row = await sql`
          INSERT INTO ops_campaigns (
            plan_id, name, label, sort, month, monthly, series_id, span_from, span_to
          ) VALUES (
            ${planId}, ${campaign.name}, ${campaign.label}, ${campaignIndex},
            ${month}::date, ${monthly}, ${seriesId}::uuid, ${spanFrom}::date, ${spanTo}::date
          )
          RETURNING id
        `;
        const campaignId = String(row[0].id);
        if (!firstCampaignId) firstCampaignId = campaignId;
        const sets = campaign.sets.filter((set) => set.month === month);
        for (const [setIndex, set] of sets.entries()) {
          const setRow = await sql`
            INSERT INTO ops_ad_sets (
              campaign_id, month, name, kind, window_label, message, ads_label,
              brands, zone_note, whatsapp, daily_budget, days, sort
            ) VALUES (
              ${campaignId}, ${set.month}::date, ${set.name}, ${set.kind}, ${set.windowLabel},
              ${set.message}, ${set.adsLabel}, ${set.brands}, ${set.zoneNote}, ${set.whatsapp},
              ${set.dailyBudget}, ${set.days}, ${setIndex}
            )
            RETURNING id
          `;
          const setId = String(setRow[0].id);
          for (const [adIndex, ad] of set.ads.entries()) {
            await sql`
              INSERT INTO ops_ads (ad_set_id, name, angle, body, prefilled, sort)
              VALUES (${setId}, ${ad.name}, ${ad.angle}, ${ad.body}, ${ad.prefilled}, ${adIndex})
            `;
          }
        }
      }

      if (campaign.audience && firstCampaignId) {
        await sql`
          INSERT INTO ops_audiences (campaign_id, series_id, zone, audience, exclude_note)
          VALUES (
            ${firstCampaignId},
            ${seriesId}::uuid,
            ${campaign.audience.zone},
            ${campaign.audience.who},
            ${campaign.audience.exclude}
          )
        `;
      }
    }

    for (const [index, creative] of gallatrackPlan.creatives.entries()) {
      await sql`
        INSERT INTO ops_creatives (
          plan_id, due_on, due_label, campaign_label, ad_set_name, ad_name,
          image_feed, image_story, video_story, video_feed, copy_text, material, deliver_label, sort
        ) VALUES (
          ${planId}, ${creative.dueOn}::date, ${creative.dueLabel}, ${creative.campaignLabel},
          ${creative.adSetName}, ${creative.adName}, ${creative.imageFeed}, ${creative.imageStory},
          ${creative.videoStory}, ${creative.videoFeed}, ${creative.copy}, ${creative.material},
          ${creative.deliverLabel}, ${index}
        )
      `;
    }
  } catch (error) {
    for (const seriesId of seriesIds) {
      await sql`DELETE FROM ops_audiences WHERE series_id = ${seriesId}::uuid`;
    }
    await sql`DELETE FROM ops_campaigns WHERE plan_id = ${planId}`;
    await sql`DELETE FROM ops_plan_months WHERE plan_id = ${planId}`;
    await sql`DELETE FROM ops_plan_notes WHERE plan_id = ${planId}`;
    await sql`DELETE FROM ops_creatives WHERE plan_id = ${planId}`;
    if (createdPlan) await sql`DELETE FROM ops_plans WHERE id = ${planId}`;
    throw error;
  }
}
