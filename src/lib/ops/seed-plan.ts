import type { NeonQueryFunction } from "@neondatabase/serverless";

import gallagroPlan from "@/ops/seed/gallagro-plan.json";

type Sql = NeonQueryFunction<false, false>;

export async function seedGallagroPlan(sql: Sql) {
  const client = await sql`SELECT id FROM ops_clients WHERE slug = 'gallagro' LIMIT 1`;
  const clientId = client[0]?.id as string | undefined;
  if (!clientId) return;

  const existing = await sql`SELECT id FROM ops_plans WHERE client_id = ${clientId} LIMIT 1`;
  if (existing[0]) return;

  const created = await sql`
    INSERT INTO ops_plans (client_id, name, platform, account_ref, destination, channels)
    VALUES (
      ${clientId},
      ${gallagroPlan.name},
      ${gallagroPlan.platform},
      ${gallagroPlan.accountRef},
      ${gallagroPlan.destination},
      ${gallagroPlan.channels}
    )
    RETURNING id
  `;
  const planId = created[0].id as string;

  try {
    for (const month of gallagroPlan.months) {
      await sql`
        INSERT INTO ops_plan_months (plan_id, month, cap_amount)
        VALUES (${planId}, ${month.month}::date, ${month.cap})
      `;
    }

    for (const [index, body] of gallagroPlan.how.entries()) {
      await sql`
        INSERT INTO ops_plan_notes (plan_id, kind, body, sort)
        VALUES (${planId}, 'how', ${body}, ${index})
      `;
    }
    for (const [index, body] of gallagroPlan.pending.entries()) {
      await sql`
        INSERT INTO ops_plan_notes (plan_id, kind, body, sort)
        VALUES (${planId}, 'pending', ${body}, ${index})
      `;
    }

    for (const [campaignIndex, campaign] of gallagroPlan.campaigns.entries()) {
      const campaignRow = await sql`
        INSERT INTO ops_campaigns (plan_id, name, label, sort)
        VALUES (${planId}, ${campaign.name}, ${campaign.label}, ${campaignIndex})
        RETURNING id
      `;
      const campaignId = campaignRow[0].id as string;
      if (campaign.audience) {
        await sql`
          INSERT INTO ops_audiences (campaign_id, zone, audience, exclude_note)
          VALUES (
            ${campaignId},
            ${campaign.audience.zone},
            ${campaign.audience.who},
            ${campaign.audience.exclude}
          )
        `;
      }

      for (const [setIndex, set] of campaign.sets.entries()) {
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
        const setId = setRow[0].id as string;
        for (const [adIndex, ad] of set.ads.entries()) {
          await sql`
            INSERT INTO ops_ads (ad_set_id, name, angle, body, prefilled, sort)
            VALUES (${setId}, ${ad.name}, ${ad.angle}, ${ad.body}, ${ad.prefilled}, ${adIndex})
          `;
        }
      }
    }

    for (const [index, creative] of gallagroPlan.creatives.entries()) {
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
    await sql`DELETE FROM ops_plans WHERE id = ${planId}`;
    throw error;
  }
}
