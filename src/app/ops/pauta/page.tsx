import { connection } from "next/server";

import { OpsPlanView } from "@/components/ops/ops-plan";
import { databaseUrl, describeDatabaseUrl } from "@/lib/ops/db";
import { monthKeyFromDate, pautaMonthOptions } from "@/lib/ops/months";
import { getOpsPlan } from "@/lib/ops/plan-queries";
import { getOpsClient, listOpsClients } from "@/lib/ops/queries";

export const instant = false;

export const metadata = {
  title: "Pauta",
};

type SearchParams = Promise<{ client?: string; view?: string; ok?: string; error?: string }>;

export default async function OpsPlanPage({ searchParams }: { searchParams: SearchParams }) {
  await connection();
  const params = await searchParams;

  if (!databaseUrl()) {
    return (
      <div className="mx-auto max-w-xl px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6b726c]">Pauta</p>
        <h1 className="mt-2 text-3xl font-semibold">Falta Neon</h1>
        <p className="mt-4 text-sm leading-7 text-[#5c6560]">
          Pegá la connection string en <code>DATABASE_URL</code> (en <code>.env.local</code> y en Vercel).
        </p>
      </div>
    );
  }

  try {
    const clients = await listOpsClients();
    const client = (await getOpsClient(params.client ?? "gallagro")) ?? clients[0];
    if (!client) {
      return (
        <div className="mx-auto max-w-xl px-6 py-16">
          <h1 className="text-3xl font-semibold">No hay clientes</h1>
        </div>
      );
    }
    const plan = await getOpsPlan(client.id);
    const monthViews = plan?.months.map((month) => month.month.slice(0, 7)) ?? [];
    const allowed = new Set([...pautaMonthOptions(), ...monthViews, "creativos", "publicos", "pendientes"]);
    const today = monthKeyFromDate(new Date());
    const view = params.view && allowed.has(params.view) ? params.view : today;

    return (
      <OpsPlanView
        clients={clients}
        client={client}
        plan={plan}
        view={view}
        notice={{ ok: params.ok, error: params.error }}
      />
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Neon no respondió.";
    const parsed = describeDatabaseUrl(databaseUrl());
    return (
      <div className="mx-auto max-w-xl px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6b726c]">Pauta</p>
        <h1 className="mt-2 text-3xl font-semibold">No se pudo cargar la pauta</h1>
        <p className="mt-4 text-sm leading-7 text-[#5c6560]">{message}</p>
        <p className="mt-3 text-xs leading-6 text-[#6b726c]">
          Ahora veo scheme={parsed.scheme || "—"}, user={parsed.user || "—"}, host={parsed.host || "—"},
          database={parsed.database || "—"}.
        </p>
      </div>
    );
  }
}
