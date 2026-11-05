"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { createOpsClientAction, deleteOpsPieceAction, saveOpsPieceAction } from "@/app/ops/actions";
import { OpsSwitch } from "@/components/ops/ops-switch";
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

function formatDate(iso: string) {
  const date = new Date(`${iso}T12:00:00`);
  return `${weekdayNames[mondayIndex(date)]} ${date.getDate()} de ${monthNames[date.getMonth()]}`;
}

function confirmDelete(event: { preventDefault: () => void }) {
  if (!window.confirm("¿Eliminar esta pieza? Esta acción no se puede deshacer.")) {
    event.preventDefault();
  }
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
  const [viewing, setViewing] = useState<OpsPiece | null>(null);
  const [open, setOpen] = useState<OpsPiece | null>(null);
  const [addingClient, setAddingClient] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
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

  const monthPieces = pieces.filter((piece) => piece.publishOn.startsWith(month));
  const defaultDay = today.startsWith(month)
    ? today
    : (monthPieces[0]?.publishOn ?? `${month}-01`);
  const selectedDay = picked && picked.startsWith(month) ? picked : defaultDay;
  const selectedItems = byDay.get(selectedDay) ?? [];
  const firstAccount = labelsOf(labels, "account")[0]?.name ?? "";
  const monthTallies = {
    pillar: labelsOf(labels, "pillar").map((item) => ({
      ...item,
      count: monthPieces.filter((piece) => piece.pillar === item.name).length,
    })),
    format: labelsOf(labels, "format").map((item) => ({
      ...item,
      count: monthPieces.filter((piece) => piece.format === item.name).length,
    })),
    status: labelsOf(labels, "status").map((item) => ({
      ...item,
      count: monthPieces.filter((piece) => piece.status === item.name).length,
    })),
  };

  return (
    <div className="mx-auto flex min-h-screen w-full min-w-0 max-w-[1500px] flex-col px-4 py-5 sm:px-6">
      <header className="mb-5 grid gap-4 md:flex md:flex-wrap md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6b726c]">TRAC · Planificación</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Calendario</h1>
          <OpsSwitch client={client.slug} current="calendario" />
        </div>
        <div className="grid gap-3 sm:flex sm:flex-wrap sm:items-center sm:gap-2">
          <label className="grid text-xs text-[#5c6560] sm:relative">
            <span className="mb-1 flex items-center gap-1 sm:absolute sm:bottom-full sm:left-0 sm:mb-1">
              Cliente
              <AddPlus onClick={() => setAddingClient(true)} />
            </span>
            <select
              value={client.slug}
              onChange={(event) => router.push(href(month, event.target.value))}
              className="w-full rounded-xl border border-[#cfd4cc] bg-[#f3f1eb] px-3 py-2 text-sm sm:w-auto"
            >
              {clients.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-center justify-between gap-2 sm:contents">
            <a
              href={href(previous)}
              aria-label="Mes anterior"
              className="rounded-xl border border-[#cfd4cc] bg-[#f3f1eb] px-4 py-2 text-sm"
            >
              <span className="sm:hidden">‹</span>
              <span className="hidden sm:inline">Mes anterior</span>
            </a>
            <p className="text-center text-lg font-semibold sm:min-w-40 sm:px-2">
              {monthNames[monthNumber - 1]} {year}
            </p>
            <a
              href={href(next)}
              aria-label="Mes siguiente"
              className="rounded-xl border border-[#cfd4cc] bg-[#f3f1eb] px-4 py-2 text-sm"
            >
              <span className="sm:hidden">›</span>
              <span className="hidden sm:inline">Mes siguiente</span>
            </a>
          </div>
          <button
            type="button"
            onClick={() => setOpen(emptyPiece(`${month}-01`, firstAccount))}
            className="rounded-full bg-[#4f6f52] px-4 py-2.5 text-sm text-[#f7f5f0] sm:py-2"
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
          <div className="ops-scroll-x flex max-w-full gap-1 overflow-x-auto md:flex-wrap md:overflow-visible">
            <button
              type="button"
              onClick={() => setFilter("")}
              className={`shrink-0 rounded-full px-3 py-1 text-xs ${filter ? "bg-transparent text-[#5c6560]" : "bg-[#2a302c] text-[#f3f1eb]"}`}
            >
              Todas
            </button>
            {labelsOf(labels, "status").map((status) => (
              <button
                key={status.id}
                type="button"
                onClick={() => setFilter(status.name)}
                className="shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-xs"
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
        <div className="grid min-w-0 gap-2 md:grid-cols-2 xl:grid-cols-3">
          {upcoming.length ? (
            upcoming.map((piece) => (
              <button
                key={piece.id}
                type="button"
                onClick={() => setViewing(piece)}
                className="min-w-0 overflow-hidden rounded-xl border border-[#d5d8d1] bg-[#f7f5f0] px-3 py-2 text-left"
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

      <details className="ops-month-summary mb-5 rounded-2xl bg-[#f3f1eb]">
        <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-x-3 gap-y-1 px-4 py-3">
          <span className="text-sm font-semibold">Cómo quedó el mes</span>
          <span className="flex items-center gap-2 text-sm text-[#5c6560]">
            Piezas cargadas
            <span className="text-xl font-semibold text-[#2a302c]">{monthPieces.length}</span>
            <svg className="ops-month-chevron h-4 w-4 text-[#6b726c] transition-transform" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.58l3.3-3.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.42Z" />
            </svg>
          </span>
        </summary>
        <div className="grid gap-0 border-t border-[#e0e3dc] px-4 py-3 md:grid-cols-3 md:divide-x md:divide-dashed md:divide-[#cfd4cc]">
          <MonthTally title="Por pilar" rows={monthTallies.pillar} />
          <MonthTally title="Por formato" rows={monthTallies.format} />
          <MonthTally title="Por estado" rows={monthTallies.status} />
        </div>
      </details>

      <div className="hidden md:block">
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
                  <AddPlus end onClick={() => setOpen(emptyPiece(date, firstAccount))} />
                </div>
                <div className="space-y-1">
                  {items.map((piece) => (
                    <button key={piece.id} type="button" onClick={() => setViewing(piece)} className="block w-full text-left">
                      <PieceChip piece={piece} labels={labels} />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <section className="md:hidden">
        <div className="grid grid-cols-7 text-center text-[11px] font-semibold uppercase text-[#6b726c]">
          {weekdayNames.map((name) => (
            <p key={name}>{name.slice(0, 2)}</p>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1">
          {cells.map((day, index) => {
            if (!day) return <div key={`m-empty-${index}`} />;
            const date = isoDate(year, monthNumber, day);
            const items = byDay.get(date) ?? [];
            const classes = ["ops-mday"];
            if (date === today) classes.push("ops-mday-today");
            if (date === selectedDay) classes.push("ops-mday-selected");
            return (
              <button
                key={`m-${date}`}
                type="button"
                onClick={() => setPicked(date)}
                aria-pressed={date === selectedDay}
                aria-label={`${formatDate(date)}, ${items.length} piezas`}
                className={classes.join(" ")}
              >
                <span className="text-sm font-semibold">{day}</span>
                <span className="flex h-1.5 items-center justify-center gap-0.5">
                  {items.slice(0, 3).map((piece) => (
                    <span
                      key={piece.id}
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: colorFor(labels, "pillar", piece.pillar) }}
                    />
                  ))}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 rounded-2xl bg-[#f3f1eb] p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold first-letter:uppercase">{formatDate(selectedDay)}</h2>
            <button
              type="button"
              onClick={() => setOpen(emptyPiece(selectedDay, firstAccount))}
              className="shrink-0 rounded-full border border-[#cfd4cc] px-3 py-1.5 text-xs"
            >
              + Nueva
            </button>
          </div>
          {selectedItems.length ? (
            <div className="grid min-w-0 gap-2">
              {selectedItems.map((piece) => (
                <button
                  key={piece.id}
                  type="button"
                  onClick={() => setViewing(piece)}
                  className="min-w-0 overflow-hidden rounded-xl border border-[#d5d8d1] bg-[#f7f5f0] px-3 py-2.5 text-left"
                >
                  <p className="mb-1 text-xs text-[#5c6560]">
                    {[piece.timeLabel, piece.account, piece.status].filter(Boolean).join(" · ")}
                  </p>
                  <PieceChip piece={piece} labels={labels} />
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#5c6560]">No hay piezas este día.</p>
          )}
        </div>
      </section>

      {addingClient ? (
        <ClientForm
          month={month}
          clientSlug={client.slug}
          onClose={() => setAddingClient(false)}
        />
      ) : null}
      {viewing ? (
        <PiecePeek
          piece={viewing}
          client={client}
          month={month}
          labels={labels}
          onClose={() => setViewing(null)}
          onEdit={() => {
            setOpen(viewing);
            setViewing(null);
          }}
        />
      ) : null}
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

function MonthTally({
  title,
  rows,
}: {
  title: string;
  rows: { id: string; name: string; color: string; count: number }[];
}) {
  return (
    <div className="border-b border-dashed border-[#cfd4cc] py-3 last:border-b-0 md:border-b-0 md:px-4 md:py-0 md:first:pl-0 md:last:pr-0">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b726c]">{title}</p>
      <ul className="space-y-1">
        {rows.map((row) => (
          <li key={row.id} className="flex items-center gap-2 text-sm">
            <span className="ops-chip shrink-0" style={labelTone(row.color)}>
              <span className="ops-chip-dot" style={{ background: row.color }} />
              {row.name}
            </span>
            <span className="ops-month-rule" />
            <span className="font-semibold tabular-nums text-[#2a302c]">{row.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AddPlus({ onClick, end = false }: { onClick: () => void; end?: boolean }) {
  return (
    <button type="button" className={`ops-add${end ? " ops-add-end" : ""}`} onClick={onClick} aria-label="Nueva">
      +<span className="ops-add-label">nueva</span>
    </button>
  );
}

function ClientForm({
  month,
  clientSlug,
  onClose,
}: {
  month: string;
  clientSlug: string;
  onClose: () => void;
}) {
  const field = "w-full rounded-xl border border-[#cfd4cc] bg-white/70 px-3 py-2 text-sm text-[#2a302c]";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2a302c]/30 px-3" onClick={onClose}>
      <div className="ops-modal p-6" onClick={(event) => event.stopPropagation()}>
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b726c]">Calendario</p>
            <h2 className="mt-1 text-2xl font-semibold">Nuevo cliente</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full px-3 py-1 text-sm">
            Cerrar
          </button>
        </div>
        <form action={createOpsClientAction} className="grid gap-3">
          <input type="hidden" name="month" value={month} />
          <input type="hidden" name="clientSlug" value={clientSlug} />
          <label className="grid gap-1 text-xs">
            Nombre
            <input name="name" required autoFocus className={field} placeholder="Ej. Gallagro" />
          </label>
          <button type="submit" className="mt-2 w-fit rounded-full bg-[#4f6f52] px-4 py-2 text-sm text-[#f7f5f0]">
            Crear
          </button>
        </form>
      </div>
    </div>
  );
}

function PieceChip({ piece, labels }: { piece: OpsPiece; labels: OpsLabelRow[] }) {
  const color = colorFor(labels, "pillar", piece.pillar);
  return (
    <span className="ops-chip w-full" style={labelTone(color)}>
      <span className="ops-chip-dot" style={{ background: color }} />
      <span className="min-w-0 flex-1 truncate">
        {piece.format || "Pieza"}
        {piece.theme ? ` · ${piece.theme}` : ""}
      </span>
    </span>
  );
}

function DetailLine({ label, value }: { label: string; value: string }) {
  if (!value.trim()) return null;
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b726c]">{label}</p>
      <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[#2a302c]">{value}</p>
    </div>
  );
}

const tagKindLabels: Record<OpsLabelRow["kind"], string> = {
  account: "Cuenta",
  format: "Formato",
  pillar: "Pilar",
  status: "Estado",
};

function Tag({ labels, kind, name }: { labels: OpsLabelRow[]; kind: OpsLabelRow["kind"]; name: string }) {
  if (!name) return null;
  const color = colorFor(labels, kind, name);
  return (
    <span className="grid justify-items-start gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6b726c]">{tagKindLabels[kind]}</span>
      <span className="ops-chip" style={labelTone(color)}>
        <span className="ops-chip-dot" style={{ background: color }} />
        {name}
      </span>
    </span>
  );
}

function PiecePeek({
  piece,
  client,
  month,
  labels,
  onClose,
  onEdit,
}: {
  piece: OpsPiece;
  client: OpsClient;
  month: string;
  labels: OpsLabelRow[];
  onClose: () => void;
  onEdit: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2a302c]/30 px-3" onClick={onClose}>
      <div className="ops-modal p-6" onClick={(event) => event.stopPropagation()}>
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b726c]">
              {formatDate(piece.publishOn)}
              {piece.timeLabel ? ` · ${piece.timeLabel}` : ""}
            </p>
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6b726c]">Tema</p>
            <h2 className="mt-1 text-2xl font-semibold">{piece.theme || "Sin tema todavía"}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full px-3 py-1 text-sm">
            Cerrar
          </button>
        </div>
        <div className="mb-5 flex flex-wrap gap-x-4 gap-y-3">
          <Tag labels={labels} kind="account" name={piece.account} />
          <Tag labels={labels} kind="format" name={piece.format} />
          <Tag labels={labels} kind="pillar" name={piece.pillar} />
          <Tag labels={labels} kind="status" name={piece.status} />
        </div>
        <div className="grid gap-4">
          <DetailLine label="Material crudo" value={piece.material} />
          <DetailLine label="Copy" value={piece.copy} />
          <DetailLine label="Brief de diseño" value={piece.brief} />
          <DetailLine label="CTA" value={piece.cta} />
          <DetailLine label="A cargo" value={piece.owner} />
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-full bg-[#4f6f52] px-4 py-2 text-sm text-[#f7f5f0]"
          >
            Editar
          </button>
          <form action={deleteOpsPieceAction} onSubmit={confirmDelete}>
            <input type="hidden" name="id" value={piece.id} />
            <input type="hidden" name="clientSlug" value={client.slug} />
            <input type="hidden" name="month" value={month} />
            <button type="submit" className="rounded-full px-4 py-2 text-sm text-[#a45b5b]">
              Eliminar
            </button>
          </form>
        </div>
      </div>
    </div>
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
                onClick={confirmDelete}
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
