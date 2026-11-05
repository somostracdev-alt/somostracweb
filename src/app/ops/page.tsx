import { connection } from "next/server";

import { OpsCalendar } from "@/components/ops/ops-calendar";
import { databaseUrl } from "@/lib/ops/db";
import { getOpsClient, listOpsClients, listOpsLabels, listOpsPieces } from "@/lib/ops/queries";

export const instant = false;

type SearchParams = Promise<{ client?: string; month?: string; ok?: string; error?: string }>;

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function monthBounds(month: string) {
  const year = Number(month.slice(0, 4));
  const monthNumber = Number(month.slice(5, 7));
  const start = `${month}-01`;
  const last = new Date(year, monthNumber, 0).getDate();
  const end = `${month}-${String(last).padStart(2, "0")}`;
  return { start, end };
}

function addDays(iso: string, amount: number) {
  const date = new Date(`${iso}T12:00:00`);
  date.setDate(date.getDate() + amount);
  return date.toISOString().slice(0, 10);
}

export default async function OpsPage({ searchParams }: { searchParams: SearchParams }) {
  await connection();
  const params = await searchParams;
  const month = /^\d{4}-\d{2}$/.test(params.month ?? "") ? params.month! : currentMonth();

  if (!databaseUrl()) {
    return (
      <div className="mx-auto max-w-xl px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6b726c]">Sala de clientes</p>
        <h1 className="mt-2 text-3xl font-semibold">Falta Neon</h1>
        <p className="mt-4 text-sm leading-7 text-[#5c6560]">
          Pegá la connection string en <code>DATABASE_URL</code> (en <code>.env.local</code> y en Vercel). El
          calendario se crea solo la primera vez y carga Gallagro.
        </p>
      </div>
    );
  }

  let clients;
  let client;
  let labels;
  let pieces;
  try {
    clients = await listOpsClients();
    client = (await getOpsClient(params.client ?? "gallagro")) ?? clients[0];
    if (!client) {
      return (
        <div className="mx-auto max-w-xl px-6 py-16">
          <h1 className="text-3xl font-semibold">No hay clientes</h1>
          <p className="mt-4 text-sm text-[#5c6560]">Neon respondió, pero no se pudo crear Gallagro.</p>
        </div>
      );
    }

    const { start, end } = monthBounds(month);
    const today = new Date().toISOString().slice(0, 10);
    const from = start < today ? start : today;
    const to = end > addDays(today, 13) ? end : addDays(today, 13);
    [labels, pieces] = await Promise.all([listOpsLabels(client.id), listOpsPieces(client.id, from, to)]);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Neon no respondió.";
    return (
      <div className="mx-auto max-w-xl px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6b726c]">Sala de clientes</p>
        <h1 className="mt-2 text-3xl font-semibold">No se pudo cargar el calendario</h1>
        <p className="mt-4 text-sm leading-7 text-[#5c6560]">{message}</p>
      </div>
    );
  }

  return (
    <OpsCalendar
      clients={clients}
      client={client}
      month={month}
      pieces={pieces}
      labels={labels}
      notice={{ ok: params.ok, error: params.error }}
    />
  );
}
