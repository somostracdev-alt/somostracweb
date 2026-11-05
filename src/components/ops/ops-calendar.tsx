"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { deleteOpsPieceAction, saveOpsPieceAction } from "@/app/ops/actions";
import { labelTone } from "@/lib/ops/labels";
import type { OpsClient, OpsLabelRow, OpsPiece } from "@/lib/ops/queries";

const weekdayNames = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
const monthNames = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function isoDate(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function addDays(iso: string, amount: number) {
  const date = new Date(`${iso}T12:00:00`);
  date.setDate(date.getDate() + amount);
  return date.toISOString().slice(0, 10);
}

function mondayIndex(date: Date) {
  return (date.getDay() + 6) % 7;
}

function labelsOf(labels: OpsLabelRow[], kind: OpsLabelRow["kind"]) {
  return labels.filter((item) => item.kind === kind);
}

function colorFor(labels: OpsLabelRow[], kind: OpsLabelRow["kind"], name: string) {
  return labels.find((item) => item.kind === kind && item.name === name)?.color ?? "#7a8176";
}

function emptyPiece(publishOn: string, account: string): OpsPiece {
  return {
    id: "",
    clientId: "",
    publishOn,
    timeLabel: "",
    account,
    format: "",
    pillar: "",
    status: "Idea",
    theme: "",
    material: "",
    copy: "",
    brief: "",
    cta: "",
    owner: "",
  };
}

export function OpsCalendar({
  clients,
  client,
  month,
  pieces,
  labels,
  notice,
}: {
  clients: OpsClient[];
  client: OpsClient;
  month: string;
  pieces: OpsPiece[];
  labels: OpsLabelRow[];
  notice?: { ok?: string; error?: string };
}) {
  const router = useRouter();
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState<OpsPiece | null>(null);
  const year = Number(month.slice(0, 4));
  const monthNumber = Number(month.slice(5, 7));
  const first = new Date(year, monthNumber - 1, 1);
  const daysInMonth = new Date(year, monthNumber, 0).getDate();
  const lead = mondayIndex(first);
  const today = new Date().toISOString().slice(0, 10);
  const upcomingUntil = addDays(today, 13);

  const byDay = useMemo(() => {
    const map = new Map<string, OpsPiece[]>();
    for (const piece of pieces) {
      if (filter && piece.status !== filter) continue;
      const list = map.get(piece.publishOn) ?? [];
      list.push(piece);
      map.set(piece.publishOn, list);
    }
    return map;
  }, [pieces, filter]);

  const upcoming = pieces
    .filter((piece) => piece.publishOn >= today && piece.publishOn <= upcomingUntil)
    .filter((piece) => !filter || piece.status === filter);

  const cells = Array.from({ length: lead + daysInMonth }, (_, index) => {
    if (index < lead) return null;
    return index - lead + 1;
  });
  while (cells.length % 7 !== 0) cells.push(null);

  const previous = monthNumber === 1 ? `${year - 1}-12` : `${year}-${String(monthNumber - 1).padStart(2, "0")}`;
  const next = monthNumber === 12 ? `${year + 1}-01` : `${year}-${String(monthNumber + 1).padStart(2, "0")}`;
  const href = (nextMonth: string, nextClient = client.slug) =>
    `/ops?client=${encodeURIComponent(nextClient)}&month=${encodeURIComponent(nextMonth)}`;

  const counts = labelsOf(labels, "pillar").map((pillar) => ({
    ...pillar,
    count: pieces.filter((piece) => piece.pillar === pillar.name && piece.publishOn.startsWith(month)).length,
  }));

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1500px] flex-col px-4 py-5 sm:px-6">
      <header className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6b726c]">Sala de clientes</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Calendario</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="grid text-xs text-[#5c6560]">
            Cliente
            <select
              value={client.slug}
              onChange={(event) => router.push(href(month, event.target.value))}
              className="mt-1 rounded-xl border border-[#cfd4cc] bg-[#f3f1eb] px-3 py-2 text-sm"
            >
              {clients.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <a href={href(previous)} className="rounded-xl border border-[#cfd4cc] bg-[#f3f1eb] px-3 py-2 text-sm">
            Mes anterior
          </a>
          <p className="min-w-40 px-2 text-center text-lg font-semibold">
            {monthNames[monthNumber - 1]} {year}
          </p>
          <a href={href(next)} className="rounded-xl border border-[#cfd4cc] bg-[#f3f1eb] px-3 py-2 text-sm">
            Mes siguiente
          </a>
          <button
            type="button"
            onClick={() => setOpen(emptyPiece(`${month}-01`, labelsOf(labels, "account")[0]?.name ?? ""))}
            className="rounded-full bg-[#4f6f52] px-4 py-2 text-sm text-[#f7f5f0]"
          >
            Nueva pieza
          </button>
        </div>
      </header>

      {notice?.ok ? <p className="mb-4 rounded-xl bg-[#d7e4d6] px-4 py-2 text-sm">{notice.ok}</p> : null}
      {notice?.error ? <p className="mb-4 rounded-xl bg-[#f0d7d2] px-4 py-2 text-sm">{notice.error}</p> : null}

      <section className="mb-5 rounded-2xl bg-[#f3f1eb] p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold">Próximos 14 días</h2>
          <div className="flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => setFilter("")}
              className={`rounded-full px-3 py-1 text-xs ${filter ? "bg-transparent text-[#5c6560]" : "bg-[#2a302c] text-[#f3f1eb]"}`}
            >
              Todas
            </button>
            {labelsOf(labels, "status").map((status) => (
              <button
                key={status.id}
                type="button"
                onClick={() => setFilter(status.name)}
                className="rounded-full px-3 py-1 text-xs"
                style={
                  filter === status.name
                    ? { background: status.color, color: "#f7f5f0" }
                    : labelTone(status.color)
                }
              >
                {status.name}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {upcoming.length ? (
            upcoming.map((piece) => (
              <button
                key={piece.id}
                type="button"
                onClick={() => setOpen(piece)}
                className="rounded-xl border border-[#d5d8d1] bg-[#f7f5f0] px-3 py-2 text-left"
              >
                <p className="text-xs text-[#5c6560]">
                  {piece.publishOn.slice(8, 10)}/{piece.publishOn.slice(5, 7)} · {piece.account}
                </p>
                <PieceChip piece={piece} labels={labels} />
              </button>
            ))
          ) : (
            <p className="text-sm text-[#5c6560]">No hay piezas en los próximos 14 días con este filtro.</p>
          )}
        </div>
      </section>

      <div className="mb-3 flex flex-wrap gap-2">
        {counts.map((pillar) => (
          <span key={pillar.id} className="ops-chip" style={labelTone(pillar.color)}>
            <span className="ops-chip-dot" style={{ background: pillar.color }} />
            {pillar.name} {pillar.count}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-semibold uppercase tracking-wide text-[#6b726c]">
        {weekdayNames.map((name) => (
          <p key={name}>{name}</p>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-2">
        {cells.map((day, index) => {
          if (!day) return <div key={`empty-${index}`} className="ops-day ops-day-muted" />;
          const date = isoDate(year, monthNumber, day);
          const items = byDay.get(date) ?? [];
          return (
            <div key={date} className="ops-day">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold">{day}</p>
                <button
                  type="button"
                  onClick={() => setOpen(emptyPiece(date, labelsOf(labels, "account")[0]?.name ?? ""))}
                  className="text-xs text-[#6b726c]"
                >
                  +
                </button>
              </div>
              <div className="space-y-1">
                {items.map((piece) => (
                  <button key={piece.id} type="button" onClick={() => setOpen(piece)} className="block w-full text-left">
                    <PieceChip piece={piece} labels={labels} />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {open ? (
        <PieceDrawer
          piece={open}
          client={client}
          month={month}
          labels={labels}
          onClose={() => setOpen(null)}
        />
      ) : null}
    </div>
  );
}

function PieceChip({ piece, labels }: { piece: OpsPiece; labels: OpsLabelRow[] }) {
  const color = colorFor(labels, "pillar", piece.pillar);
  return (
    <span className="ops-chip w-full" style={labelTone(color)}>
      <span className="ops-chip-dot" style={{ background: color }} />
      <span className="truncate">
        {piece.format || "Pieza"}
        {piece.theme ? ` · ${piece.theme}` : ""}
      </span>
    </span>
  );
}

function PieceDrawer({
  piece,
  client,
  month,
  labels,
  onClose,
}: {
  piece: OpsPiece;
  client: OpsClient;
  month: string;
  labels: OpsLabelRow[];
  onClose: () => void;
}) {
  const field = "w-full rounded-xl border border-[#cfd4cc] bg-white/70 px-3 py-2 text-sm text-[#2a302c]";
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#2a302c]/25" onClick={onClose}>
      <div className="ops-drawer h-full w-full max-w-xl overflow-y-auto p-6" onClick={(event) => event.stopPropagation()}>
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b726c]">
              {piece.id ? "Editar pieza" : "Nueva pieza"}
            </p>
            <h2 className="mt-1 text-2xl font-semibold">{piece.theme || "Sin tema todavía"}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full px-3 py-1 text-sm">
            Cerrar
          </button>
        </div>
        <form action={saveOpsPieceAction} className="grid gap-3">
          <input type="hidden" name="id" value={piece.id} />
          <input type="hidden" name="clientId" value={client.id} />
          <input type="hidden" name="clientSlug" value={client.slug} />
          <input type="hidden" name="month" value={month} />
          <label className="grid gap-1 text-xs">
            Fecha
            <input name="publishOn" type="date" defaultValue={piece.publishOn} required className={field} />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <SelectField name="account" label="Cuenta" value={piece.account} options={labelsOf(labels, "account")} className={field} />
            <SelectField name="format" label="Formato" value={piece.format} options={labelsOf(labels, "format")} className={field} />
            <SelectField name="pillar" label="Pilar" value={piece.pillar} options={labelsOf(labels, "pillar")} className={field} />
            <SelectField name="status" label="Estado" value={piece.status} options={labelsOf(labels, "status")} className={field} />
          </div>
          <label className="grid gap-1 text-xs">
            Tema
            <input name="theme" defaultValue={piece.theme} className={field} />
          </label>
          <label className="grid gap-1 text-xs">
            Material crudo
            <textarea name="material" defaultValue={piece.material} rows={3} className={field} />
          </label>
          <label className="grid gap-1 text-xs">
            Copy
            <textarea name="copy" defaultValue={piece.copy} rows={4} className={field} />
          </label>
          <label className="grid gap-1 text-xs">
            Brief de diseño
            <textarea name="brief" defaultValue={piece.brief} rows={4} className={field} />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-xs">
              CTA
              <input name="cta" defaultValue={piece.cta} className={field} />
            </label>
            <label className="grid gap-1 text-xs">
              A cargo
              <input name="owner" defaultValue={piece.owner} className={field} />
            </label>
          </div>
          <label className="grid gap-1 text-xs">
            Hora
            <input name="timeLabel" defaultValue={piece.timeLabel} className={field} />
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            <button type="submit" className="rounded-full bg-[#4f6f52] px-4 py-2 text-sm text-[#f7f5f0]">
              Guardar
            </button>
            {piece.id ? (
              <button
                type="submit"
                formAction={deleteOpsPieceAction}
                className="rounded-full px-4 py-2 text-sm text-[#a45b5b]"
              >
                Borrar
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}

function SelectField({
  name,
  label,
  value,
  options,
  className,
}: {
  name: string;
  label: string;
  value: string;
  options: OpsLabelRow[];
  className: string;
}) {
  return (
    <label className="grid gap-1 text-xs">
      {label}
      <select name={name} defaultValue={value} className={className}>
        <option value="">Elegir</option>
        {options.map((option) => (
          <option key={option.id} value={option.name}>
            {option.name}
          </option>
        ))}
      </select>
    </label>
  );
}
