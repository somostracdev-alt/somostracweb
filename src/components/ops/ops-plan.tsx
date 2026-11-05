"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import {
  deleteOpsAdAction,
  deleteOpsAdSetAction,
  deleteOpsCampaignAction,
  saveOpsAdAction,
  saveOpsAdSetAction,
  saveOpsAudienceAction,
  saveOpsCampaignAction,
  saveOpsCreativeAction,
  toggleOpsPlanNoteAction,
} from "@/app/ops/pauta/actions";
import { OpsSwitch } from "@/components/ops/ops-switch";
import type { OpsPlan, PlanAd, PlanAdSet, PlanCampaign, PlanCreative } from "@/lib/ops/plan-queries";
import type { OpsClient } from "@/lib/ops/queries";

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

const kindLabel = {
  always_on: "Always on",
  special: "Especial",
  off: "Apagada",
} as const;

const kindTone = {
  always_on: { color: "#2f5d34", background: "#2f5d3422", borderColor: "#2f5d3455" },
  special: { color: "#8a5a12", background: "#8a5a1222", borderColor: "#8a5a1255" },
  off: { color: "#6b726c", background: "#6b726c22", borderColor: "#6b726c55" },
} as const;

const field = "w-full rounded-xl border border-[#cfd4cc] bg-white/70 px-3 py-2 text-sm text-[#2a302c]";

type Peek =
  | { kind: "campaign" | "set" | "ad" | "creative" | "audience"; id: string }
  | null;

type Editor =
  | { kind: "campaign" | "audience" | "creative"; id: string }
  | { kind: "set"; id: string; campaignId: string }
  | { kind: "ad"; id: string; setId: string }
  | null;

function pesos(value: number | null) {
  if (value === null) return "—";
  return `$${value.toLocaleString("es-AR")}`;
}

function monthTitle(month: string) {
  const date = new Date(`${month.slice(0, 7)}-01T12:00:00`);
  return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

function daysInMonth(month: string) {
  const year = Number(month.slice(0, 4));
  const monthNumber = Number(month.slice(5, 7));
  return new Date(year, monthNumber, 0).getDate();
}

function counts(set: PlanAdSet) {
  if (set.kind === "off" || set.dailyBudget === null) return null;
  return { daily: set.dailyBudget, month: set.dailyBudget * set.days };
}

function pieceCount(item: PlanCreative) {
  return item.imageFeed + item.imageStory + item.videoStory + item.videoFeed;
}

function confirmDelete(message: string) {
  return (event: { preventDefault: () => void }) => {
    if (!window.confirm(message)) event.preventDefault();
  };
}

function Caption({ children }: { children: string }) {
  return <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6b726c]">{children}</span>;
}

function DetailLine({ label, value }: { label: string; value: string }) {
  if (!value.trim()) return null;
  return (
    <div>
      <Caption>{label}</Caption>
      <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[#2a302c]">{value}</p>
    </div>
  );
}

function Tag({ label, value, tone = kindTone.off }: { label: string; value: string; tone?: (typeof kindTone)[keyof typeof kindTone] }) {
  if (!value.trim()) return null;
  return (
    <span className="grid justify-items-start gap-1">
      <Caption>{label}</Caption>
      <span className="ops-chip" style={tone}>
        <span className="ops-chip-dot" style={{ background: tone.color }} />
        {value}
      </span>
    </span>
  );
}

function findSet(plan: OpsPlan, id: string) {
  for (const campaign of plan.campaigns) {
    const set = campaign.sets.find((item) => item.id === id);
    if (set) return { campaign, set };
  }
  return null;
}

function findAd(plan: OpsPlan, id: string) {
  for (const campaign of plan.campaigns) {
    for (const set of campaign.sets) {
      const ad = set.ads.find((item) => item.id === id);
      if (ad) return { campaign, set, ad };
    }
  }
  return null;
}

function blankSet(campaignId: string, month: string): PlanAdSet {
  return {
    id: "",
    campaignId,
    month,
    name: "",
    kind: "always_on",
    windowLabel: "",
    message: "",
    adsLabel: "",
    brands: "",
    zoneNote: "",
    whatsapp: "",
    dailyBudget: null,
    days: daysInMonth(month),
    ads: [],
  };
}

export function OpsPlanView({
  clients,
  client,
  plan,
  view,
  notice,
}: {
  clients: OpsClient[];
  client: OpsClient;
  plan: OpsPlan | null;
  view: string;
  notice?: { ok?: string; error?: string };
}) {
  const router = useRouter();
  const [peek, setPeek] = useState<Peek>(null);
  const [editor, setEditor] = useState<Editor>(null);
  const href = (nextView: string, nextClient = client.slug) =>
    `/ops/pauta?client=${encodeURIComponent(nextClient)}&view=${encodeURIComponent(nextView)}`;
  const monthKey = /^\d{4}-\d{2}$/.test(view) ? `${view}-01` : "";

  useEffect(() => {
    setEditor(null);
    setPeek(null);
  }, [notice?.ok, notice?.error, view]);

  const tabs = [
    ...(plan?.months.map((month) => ({ id: month.month.slice(0, 7), label: monthTitle(month.month) })) ?? []),
    { id: "creativos", label: "Creativos" },
    { id: "publicos", label: "Públicos" },
    { id: "pendientes", label: "Pendientes" },
  ];

  return (
    <div className="mx-auto flex min-h-screen w-full min-w-0 max-w-6xl flex-col px-4 py-5 sm:px-6">
      <header className="mb-5 grid gap-4 sm:flex sm:flex-wrap sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6b726c]">TRAC · Planificación</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Pauta</h1>
          <OpsSwitch client={client.slug} current="pauta" />
        </div>
        <div className="grid gap-3 sm:flex sm:flex-wrap sm:items-center">
          <label className="grid text-xs text-[#5c6560] sm:relative">
            <span className="mb-1 sm:absolute sm:bottom-full sm:left-0 sm:mb-1">Cliente</span>
            <select
              value={client.slug}
              onChange={(event) => router.push(href(view, event.target.value))}
              className="w-full rounded-xl border border-[#cfd4cc] bg-[#f3f1eb] px-3 py-2 text-sm sm:w-auto"
            >
              {clients.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => setEditor({ kind: "campaign", id: "" })}
            className="rounded-full bg-[#4f6f52] px-4 py-2.5 text-sm text-[#f7f5f0] sm:py-2"
          >
            Nueva campaña
          </button>
        </div>
      </header>

      {notice?.ok ? <p className="mb-4 rounded-xl bg-[#d7e4d6] px-4 py-2 text-sm">{notice.ok}</p> : null}
      {notice?.error ? <p className="mb-4 rounded-xl bg-[#f0d7d2] px-4 py-2 text-sm">{notice.error}</p> : null}

      {!plan ? (
        <button
          type="button"
          onClick={() => setEditor({ kind: "campaign", id: "" })}
          className="rounded-2xl border border-dashed border-[#b7bdb6] bg-[#f3f1eb] px-4 py-8 text-left"
        >
          <Caption>Agregar</Caption>
          <span className="mt-1 block text-lg font-semibold">Nueva campaña</span>
          <span className="mt-1 block text-sm text-[#5c6560]">Este cliente todavía no tiene pauta.</span>
        </button>
      ) : (
        <>
          <p className="mb-4 text-sm text-[#5c6560]">
            {plan.platform} · cuenta {plan.accountRef} · {plan.channels} · destino {plan.destination}
          </p>
          <div className="ops-scroll-x mb-5 flex max-w-full gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => router.push(href(tab.id))}
                className={`shrink-0 rounded-full px-3 py-1.5 text-sm ${
                  view === tab.id ? "bg-[#2a302c] text-[#f7f5f0]" : "border border-[#cfd4cc] bg-[#f3f1eb]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {monthKey ? (
            <MonthBoard
              plan={plan}
              monthKey={monthKey}
              onCampaign={(id) => setPeek({ kind: "campaign", id })}
              onSet={(id) => setPeek({ kind: "set", id })}
              onNewSet={(campaignId) => setEditor({ kind: "set", id: "", campaignId })}
              onNewCampaign={() => setEditor({ kind: "campaign", id: "" })}
            />
          ) : null}
          {view === "creativos" ? <CreativeBoard plan={plan} onOpen={(id) => setPeek({ kind: "creative", id })} /> : null}
          {view === "publicos" ? <AudienceBoard plan={plan} onOpen={(id) => setPeek({ kind: "audience", id })} /> : null}
          {view === "pendientes" ? <PendingBoard plan={plan} clientSlug={client.slug} view={view} /> : null}
        </>
      )}

      {plan && peek?.kind === "campaign" ? (
        <CampaignPeek
          campaign={plan.campaigns.find((item) => item.id === peek.id) ?? null}
          client={client}
          view={view}
          onClose={() => setPeek(null)}
          onEdit={(id) => {
            setPeek(null);
            setEditor({ kind: "campaign", id });
          }}
        />
      ) : null}
      {plan && peek?.kind === "set" ? (
        <SetPeek
          found={findSet(plan, peek.id)}
          client={client}
          view={view}
          onClose={() => setPeek(null)}
          onEdit={(set) => {
            setPeek(null);
            setEditor({ kind: "set", id: set.id, campaignId: set.campaignId });
          }}
          onAd={(id) => setPeek({ kind: "ad", id })}
          onNewAd={(setId) => {
            setPeek(null);
            setEditor({ kind: "ad", id: "", setId });
          }}
        />
      ) : null}
      {plan && peek?.kind === "ad" ? (
        <AdPeek
          found={findAd(plan, peek.id)}
          client={client}
          view={view}
          onClose={() => setPeek(null)}
          onBack={(setId) => setPeek({ kind: "set", id: setId })}
          onEdit={(ad, setId) => {
            setPeek(null);
            setEditor({ kind: "ad", id: ad.id, setId });
          }}
        />
      ) : null}
      {plan && peek?.kind === "creative" ? (
        <CreativePeek
          item={plan.creatives.find((item) => item.id === peek.id) ?? null}
          onClose={() => setPeek(null)}
          onEdit={(id) => {
            setPeek(null);
            setEditor({ kind: "creative", id });
          }}
        />
      ) : null}
      {plan && peek?.kind === "audience" ? (
        <AudiencePeek
          campaign={plan.campaigns.find((item) => item.id === peek.id) ?? null}
          onClose={() => setPeek(null)}
          onEdit={(id) => {
            setPeek(null);
            setEditor({ kind: "audience", id });
          }}
        />
      ) : null}

      {editor?.kind === "campaign" ? (
        <CampaignDrawer
          campaign={plan?.campaigns.find((item) => item.id === editor.id) ?? null}
          client={client}
          view={view}
          onClose={() => setEditor(null)}
        />
      ) : null}
      {editor?.kind === "set" && monthKey ? (
        <SetDrawer
          set={findSet(plan ?? emptyPlan(), editor.id)?.set ?? blankSet(editor.campaignId, monthKey)}
          campaign={plan?.campaigns.find((item) => item.id === editor.campaignId) ?? null}
          client={client}
          view={view}
          onClose={() => setEditor(null)}
        />
      ) : null}
      {editor?.kind === "ad" ? (
        <AdDrawer
          ad={findAd(plan ?? emptyPlan(), editor.id)?.ad ?? null}
          setId={editor.setId}
          client={client}
          view={view}
          onClose={() => setEditor(null)}
        />
      ) : null}
      {editor?.kind === "creative" ? (
        <CreativeDrawer
          item={plan?.creatives.find((item) => item.id === editor.id) ?? null}
          client={client}
          view={view}
          onClose={() => setEditor(null)}
        />
      ) : null}
      {editor?.kind === "audience" ? (
        <AudienceDrawer
          campaign={plan?.campaigns.find((item) => item.id === editor.id) ?? null}
          client={client}
          view={view}
          onClose={() => setEditor(null)}
        />
      ) : null}
    </div>
  );
}

function emptyPlan(): OpsPlan {
  return {
    id: "",
    name: "",
    platform: "",
    accountRef: "",
    destination: "",
    channels: "",
    months: [],
    notes: [],
    campaigns: [],
    creatives: [],
  };
}

function MonthBoard({
  plan,
  monthKey,
  onCampaign,
  onSet,
  onNewSet,
  onNewCampaign,
}: {
  plan: OpsPlan;
  monthKey: string;
  onCampaign: (id: string) => void;
  onSet: (id: string) => void;
  onNewSet: (campaignId: string) => void;
  onNewCampaign: () => void;
}) {
  const monthSets = plan.campaigns.flatMap((campaign) =>
    campaign.sets.filter((set) => set.month === monthKey).map((set) => ({ campaign, set })),
  );
  const live = monthSets.flatMap((item) => {
    const money = counts(item.set);
    return money ? [money] : [];
  });
  const cap = plan.months.find((month) => month.month === monthKey)?.cap ?? 0;
  const dailyTotal = live.reduce((sum, item) => sum + item.daily, 0);
  const monthTotal = live.reduce((sum, item) => sum + item.month, 0);
  const margin = cap - monthTotal;
  const how = plan.notes.filter((note) => note.kind === "how");
  const stats = [
    ["Conjuntos con pauta", String(live.length)],
    ["$/día total", pesos(dailyTotal)],
    ["$/mes total", pesos(monthTotal)],
    ["Tope", pesos(cap)],
    ["Margen", pesos(margin)],
  ];

  return (
    <div className="grid gap-4">
      <section className="grid gap-2 sm:grid-cols-5">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-[#f3f1eb] px-4 py-3">
            <Caption>{label}</Caption>
            <p className="mt-1 text-lg font-semibold">{value}</p>
          </div>
        ))}
      </section>

      {how.length ? (
        <details className="ops-month-summary rounded-2xl bg-[#f3f1eb] px-4 py-3">
          <summary className="flex cursor-pointer items-center justify-between gap-3 text-sm font-semibold">
            Cómo está armado
            <span className="ops-month-chevron text-xs text-[#6b726c]">⌄</span>
          </summary>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-[#3c4440]">
            {how.map((note) => (
              <li key={note.id}>{note.body}</li>
            ))}
          </ul>
        </details>
      ) : null}

      {plan.campaigns.map((campaign) => {
        const rows = campaign.sets.filter((set) => set.month === monthKey);
        return (
          <section key={campaign.id} className="rounded-2xl bg-[#f3f1eb] p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <button type="button" onClick={() => onCampaign(campaign.id)} className="min-w-0 text-left">
                <Caption>Campaña</Caption>
                <h2 className="truncate text-base font-semibold">{campaign.label || campaign.name}</h2>
                <p className="truncate text-xs text-[#6b726c]">{campaign.name}</p>
              </button>
              <button
                type="button"
                onClick={() => onNewSet(campaign.id)}
                className="shrink-0 rounded-full border border-[#cfd4cc] bg-white/70 px-3 py-1.5 text-xs"
              >
                + Conjunto
              </button>
            </div>
            <div className="grid gap-2">
              {rows.length ? (
                rows.map((set) => {
                  const money = counts(set);
                  return (
                    <button
                      key={set.id}
                      type="button"
                      onClick={() => onSet(set.id)}
                      className="flex w-full min-w-0 items-center gap-3 rounded-xl bg-[#e7e4dc] px-3 py-2 text-left"
                    >
                      <span className="min-w-0 flex-1">
                        <Caption>Conjunto</Caption>
                        <span className="block truncate text-sm font-semibold">{set.name}</span>
                      </span>
                      <span className="ops-chip shrink-0" style={kindTone[set.kind]}>
                        <span className="ops-chip-dot" style={{ background: kindTone[set.kind].color }} />
                        {kindLabel[set.kind]}
                      </span>
                      <span className="shrink-0 text-right">
                        <Caption>$/mes</Caption>
                        <span className="block text-sm font-semibold tabular-nums">{money ? pesos(money.month) : "—"}</span>
                      </span>
                    </button>
                  );
                })
              ) : (
                <p className="text-sm text-[#6b726c]">Sin conjuntos en este mes.</p>
              )}
            </div>
          </section>
        );
      })}

      <button
        type="button"
        onClick={onNewCampaign}
        className="rounded-2xl border border-dashed border-[#b7bdb6] bg-[#f3f1eb] px-4 py-4 text-left"
      >
        <Caption>Agregar</Caption>
        <span className="mt-1 block font-semibold">Nueva campaña</span>
      </button>
    </div>
  );
}

function CreativeBoard({ plan, onOpen }: { plan: OpsPlan; onOpen: (id: string) => void }) {
  const groups: { label: string; items: PlanCreative[] }[] = [];
  for (const item of plan.creatives) {
    const last = groups.at(-1);
    if (last?.label === item.dueLabel) last.items.push(item);
    else groups.push({ label: item.dueLabel, items: [item] });
  }

  return (
    <div className="grid gap-5">
      {groups.map((group) => {
        const total = group.items.reduce((sum, item) => sum + pieceCount(item), 0);
        const title = /^\d{1,2}\/\d{1,2}$/.test(group.label) ? `Para el ${group.label}` : group.label;
        return (
          <section key={group.label} className="grid gap-2">
            <div className="flex items-baseline justify-between gap-3 px-1">
              <h2 className="text-sm font-semibold">{title}</h2>
              <p className="text-xs text-[#6b726c]">{total} piezas</p>
            </div>
            {group.items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onOpen(item.id)}
                className="flex w-full min-w-0 items-center gap-3 rounded-2xl bg-[#f3f1eb] px-4 py-3 text-left"
              >
                <span className="min-w-0 flex-1">
                  <Caption>Anuncio</Caption>
                  <span className="block truncate text-sm font-semibold">{item.adName}</span>
                  <span className="block truncate text-xs text-[#6b726c]">{item.campaignLabel}</span>
                </span>
                <span className="hidden shrink-0 text-right sm:block">
                  <Caption>Para</Caption>
                  <span className="block text-sm">{item.dueLabel}</span>
                </span>
                <span className="ops-chip shrink-0" style={kindTone[item.deliverLabel === "Urgente" ? "special" : "off"]}>
                  {item.deliverLabel}
                </span>
              </button>
            ))}
          </section>
        );
      })}
    </div>
  );
}

function AudienceBoard({ plan, onOpen }: { plan: OpsPlan; onOpen: (id: string) => void }) {
  return (
    <div className="grid gap-2">
      {plan.campaigns.map((campaign) => (
        <button
          key={campaign.id}
          type="button"
          onClick={() => onOpen(campaign.id)}
          className="flex w-full min-w-0 items-center gap-3 rounded-2xl bg-[#f3f1eb] px-4 py-3 text-left"
        >
          <span className="min-w-0 flex-1">
            <Caption>Campaña</Caption>
            <span className="block truncate text-sm font-semibold">{campaign.label || campaign.name}</span>
          </span>
          <span className="min-w-0 max-w-[55%] text-right">
            <Caption>Zona</Caption>
            <span className="block truncate text-sm">{campaign.audience?.zone || "Sin público"}</span>
          </span>
        </button>
      ))}
    </div>
  );
}

function PendingBoard({ plan, clientSlug, view }: { plan: OpsPlan; clientSlug: string; view: string }) {
  const notes = plan.notes.filter((note) => note.kind === "pending");
  const done = notes.filter((note) => note.done).length;
  return (
    <div className="grid gap-2">
      <p className="px-1 text-sm text-[#5c6560]">
        Pendientes antes de cargar · {done} de {notes.length} listos
      </p>
      {notes.map((note) => (
        <form key={note.id} action={toggleOpsPlanNoteAction} className="flex items-start gap-3 rounded-2xl bg-[#f3f1eb] px-4 py-3">
          <input type="hidden" name="clientSlug" value={clientSlug} />
          <input type="hidden" name="view" value={view} />
          <input type="hidden" name="id" value={note.id} />
          <input type="hidden" name="done" value={note.done ? "0" : "1"} />
          <button
            type="submit"
            className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border text-xs ${
              note.done ? "border-[#2f5d34] bg-[#2f5d34] text-white" : "border-[#b7bdb6] bg-white"
            }`}
            aria-label={note.done ? "Marcar como pendiente" : "Marcar como listo"}
          >
            {note.done ? "✓" : ""}
          </button>
          <p className={`text-sm leading-6 ${note.done ? "text-[#6b726c] line-through" : ""}`}>{note.body}</p>
        </form>
      ))}
    </div>
  );
}

function Popup({
  kicker,
  titleLabel,
  title,
  onClose,
  children,
}: {
  kicker: string;
  titleLabel: string;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2a302c]/30 px-3" onClick={onClose}>
      <div className="ops-modal p-6" onClick={(event) => event.stopPropagation()}>
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b726c]">{kicker}</p>
            <p className="mt-3">
              <Caption>{titleLabel}</Caption>
            </p>
            <h2 className="mt-1 text-2xl font-semibold">{title}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full px-3 py-1 text-sm">
            Cerrar
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function CampaignPeek({
  campaign,
  client,
  view,
  onClose,
  onEdit,
}: {
  campaign: PlanCampaign | null;
  client: OpsClient;
  view: string;
  onClose: () => void;
  onEdit: (id: string) => void;
}) {
  if (!campaign) return null;
  return (
    <Popup kicker="Pauta" titleLabel="Campaña" title={campaign.label || campaign.name} onClose={onClose}>
      <div className="grid gap-4">
        <DetailLine label="Nombre en la cuenta" value={campaign.name} />
        <DetailLine label="Zona" value={campaign.audience?.zone ?? ""} />
        <DetailLine label="A quién le hablamos" value={campaign.audience?.who ?? ""} />
        <DetailLine label="Excluir" value={campaign.audience?.exclude ?? ""} />
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <button type="button" onClick={() => onEdit(campaign.id)} className="rounded-full bg-[#4f6f52] px-4 py-2 text-sm text-[#f7f5f0]">
          Editar
        </button>
        <form action={deleteOpsCampaignAction} onSubmit={confirmDelete("¿Eliminar esta campaña y sus conjuntos?")}>
          <input type="hidden" name="id" value={campaign.id} />
          <input type="hidden" name="clientSlug" value={client.slug} />
          <input type="hidden" name="view" value={view} />
          <button type="submit" className="rounded-full px-4 py-2 text-sm text-[#a45b5b]">
            Eliminar
          </button>
        </form>
      </div>
    </Popup>
  );
}

function SetPeek({
  found,
  client,
  view,
  onClose,
  onEdit,
  onAd,
  onNewAd,
}: {
  found: { campaign: PlanCampaign; set: PlanAdSet } | null;
  client: OpsClient;
  view: string;
  onClose: () => void;
  onEdit: (set: PlanAdSet) => void;
  onAd: (id: string) => void;
  onNewAd: (setId: string) => void;
}) {
  if (!found) return null;
  const { campaign, set } = found;
  const money = counts(set);
  const budget = money ? `${pesos(money.daily)} × ${set.days} días = ${pesos(money.month)}` : "Sin presupuesto";
  return (
    <Popup kicker={campaign.label || campaign.name} titleLabel="Conjunto" title={set.name} onClose={onClose}>
      <div className="mb-5 flex flex-wrap gap-x-4 gap-y-3">
        <Tag label="Tipo" value={kindLabel[set.kind]} tone={kindTone[set.kind]} />
        <Tag label="WhatsApp" value={set.whatsapp} />
      </div>
      <div className="grid gap-4">
        <DetailLine label="Vigencia" value={set.windowLabel} />
        <DetailLine label="Presupuesto" value={budget} />
        <DetailLine label="Qué comunicamos" value={set.message} />
        <DetailLine label="Marcas" value={set.brands} />
        <DetailLine label="Anuncios previstos" value={set.adsLabel} />
        <DetailLine label="Zona y público" value={set.zoneNote} />
      </div>
      <div className="mt-5">
        <Caption>Anuncios</Caption>
        <div className="mt-2 grid gap-2">
          {set.ads.map((ad) => (
            <button
              key={ad.id}
              type="button"
              onClick={() => onAd(ad.id)}
              className="flex w-full min-w-0 items-center justify-between gap-3 rounded-xl bg-[#e7e4dc] px-3 py-2 text-left"
            >
              <span className="min-w-0">
                <Caption>Anuncio</Caption>
                <span className="block truncate text-sm font-semibold">{ad.name}</span>
              </span>
              {ad.angle ? <span className="ops-chip shrink-0" style={kindTone.off}>{ad.angle}</span> : null}
            </button>
          ))}
          <button type="button" onClick={() => onNewAd(set.id)} className="rounded-xl border border-dashed border-[#b7bdb6] px-3 py-2 text-left text-sm">
            + Nuevo anuncio
          </button>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <button type="button" onClick={() => onEdit(set)} className="rounded-full bg-[#4f6f52] px-4 py-2 text-sm text-[#f7f5f0]">
          Editar
        </button>
        <form action={deleteOpsAdSetAction} onSubmit={confirmDelete("¿Eliminar este conjunto y sus anuncios?")}>
          <input type="hidden" name="id" value={set.id} />
          <input type="hidden" name="clientSlug" value={client.slug} />
          <input type="hidden" name="view" value={view} />
          <button type="submit" className="rounded-full px-4 py-2 text-sm text-[#a45b5b]">
            Eliminar
          </button>
        </form>
      </div>
    </Popup>
  );
}

function AdPeek({
  found,
  client,
  view,
  onClose,
  onBack,
  onEdit,
}: {
  found: { campaign: PlanCampaign; set: PlanAdSet; ad: PlanAd } | null;
  client: OpsClient;
  view: string;
  onClose: () => void;
  onBack: (setId: string) => void;
  onEdit: (ad: PlanAd, setId: string) => void;
}) {
  if (!found) return null;
  const { set, ad } = found;
  return (
    <Popup kicker={set.name} titleLabel="Anuncio" title={ad.name} onClose={onClose}>
      <div className="mb-5 flex flex-wrap gap-x-4 gap-y-3">
        <Tag label="Ángulo" value={ad.angle} tone={kindTone.special} />
      </div>
      <div className="grid gap-4">
        <DetailLine label="Qué dice" value={ad.body} />
        <DetailLine label="Mensaje precargado" value={ad.prefilled} />
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <button type="button" onClick={() => onBack(set.id)} className="rounded-full border border-[#cfd4cc] px-4 py-2 text-sm">
          Volver al conjunto
        </button>
        <button type="button" onClick={() => onEdit(ad, set.id)} className="rounded-full bg-[#4f6f52] px-4 py-2 text-sm text-[#f7f5f0]">
          Editar
        </button>
        <form action={deleteOpsAdAction} onSubmit={confirmDelete("¿Eliminar este anuncio?")}>
          <input type="hidden" name="id" value={ad.id} />
          <input type="hidden" name="clientSlug" value={client.slug} />
          <input type="hidden" name="view" value={view} />
          <button type="submit" className="rounded-full px-4 py-2 text-sm text-[#a45b5b]">
            Eliminar
          </button>
        </form>
      </div>
    </Popup>
  );
}

function CreativePeek({
  item,
  onClose,
  onEdit,
}: {
  item: PlanCreative | null;
  onClose: () => void;
  onEdit: (id: string) => void;
}) {
  if (!item) return null;
  const title = /^\d{1,2}\/\d{1,2}$/.test(item.dueLabel) ? `Para el ${item.dueLabel}` : item.dueLabel;
  return (
    <Popup kicker={`${item.campaignLabel} · ${item.adSetName}`} titleLabel="Anuncio" title={item.adName} onClose={onClose}>
      <div className="mb-5 flex flex-wrap gap-x-4 gap-y-3">
        <Tag label="Para" value={title} />
        <Tag label="Entrega" value={item.deliverLabel} tone={kindTone[item.deliverLabel === "Urgente" ? "special" : "off"]} />
      </div>
      <div className="grid gap-4">
        <DetailLine label="Qué dice" value={item.copy} />
        <DetailLine label="Material necesario" value={item.material} />
        <DetailLine label="Imagen 4:5" value={`${item.imageFeed}`} />
        <DetailLine label="Imagen 9:16" value={`${item.imageStory}`} />
        <DetailLine label="Video 9:16" value={`${item.videoStory}`} />
        <DetailLine label="Video 4:5" value={`${item.videoFeed}`} />
      </div>
      <button type="button" onClick={() => onEdit(item.id)} className="mt-6 rounded-full bg-[#4f6f52] px-4 py-2 text-sm text-[#f7f5f0]">
        Editar
      </button>
    </Popup>
  );
}

function AudiencePeek({
  campaign,
  onClose,
  onEdit,
}: {
  campaign: PlanCampaign | null;
  onClose: () => void;
  onEdit: (id: string) => void;
}) {
  if (!campaign) return null;
  return (
    <Popup kicker={campaign.name} titleLabel="Campaña" title={campaign.label || campaign.name} onClose={onClose}>
      <div className="grid gap-4">
        <DetailLine label="Zona" value={campaign.audience?.zone ?? ""} />
        <DetailLine label="A quién le hablamos" value={campaign.audience?.who ?? ""} />
        <DetailLine label="Excluir" value={campaign.audience?.exclude ?? ""} />
      </div>
      {!campaign.audience ? <p className="text-sm text-[#5c6560]">Esta campaña todavía no tiene público.</p> : null}
      <button type="button" onClick={() => onEdit(campaign.id)} className="mt-6 rounded-full bg-[#4f6f52] px-4 py-2 text-sm text-[#f7f5f0]">
        Editar
      </button>
    </Popup>
  );
}

function Drawer({ kicker, title, onClose, children }: { kicker: string; title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#2a302c]/25" onClick={onClose}>
      <div className="ops-drawer h-full w-full max-w-xl overflow-y-auto p-6" onClick={(event) => event.stopPropagation()}>
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b726c]">{kicker}</p>
            <h2 className="mt-1 text-2xl font-semibold">{title}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full px-3 py-1 text-sm">
            Cerrar
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function CampaignDrawer({
  campaign,
  client,
  view,
  onClose,
}: {
  campaign: PlanCampaign | null;
  client: OpsClient;
  view: string;
  onClose: () => void;
}) {
  return (
    <Drawer kicker="Campaña" title={campaign ? "Editar campaña" : "Nueva campaña"} onClose={onClose}>
      <form action={saveOpsCampaignAction} className="grid gap-3">
        <input type="hidden" name="id" value={campaign?.id ?? ""} />
        <input type="hidden" name="clientId" value={client.id} />
        <input type="hidden" name="clientSlug" value={client.slug} />
        <input type="hidden" name="view" value={view} />
        <label className="grid gap-1 text-xs">
          Nombre
          <input name="label" required defaultValue={campaign?.label ?? ""} autoFocus className={field} placeholder="Ej. Repuestos" />
        </label>
        <label className="grid gap-1 text-xs">
          Nombre en la cuenta
          <input name="name" defaultValue={campaign?.name ?? ""} className={field} placeholder="Ej. PROS_Repuestos" />
        </label>
        <button type="submit" className="mt-2 w-fit rounded-full bg-[#4f6f52] px-4 py-2 text-sm text-[#f7f5f0]">
          {campaign ? "Guardar" : "Crear"}
        </button>
      </form>
    </Drawer>
  );
}

function SetDrawer({
  set,
  campaign,
  client,
  view,
  onClose,
}: {
  set: PlanAdSet;
  campaign: PlanCampaign | null;
  client: OpsClient;
  view: string;
  onClose: () => void;
}) {
  return (
    <Drawer kicker={campaign?.label || "Conjunto"} title={set.id ? "Editar conjunto" : "Nuevo conjunto"} onClose={onClose}>
      <form action={saveOpsAdSetAction} className="grid gap-3">
        <input type="hidden" name="id" value={set.id} />
        <input type="hidden" name="campaignId" value={set.campaignId} />
        <input type="hidden" name="clientSlug" value={client.slug} />
        <input type="hidden" name="view" value={view} />
        <label className="grid gap-1 text-xs">
          Conjunto
          <input name="name" required defaultValue={set.name} autoFocus className={field} placeholder="Ej. AO_Repuestos" />
        </label>
        <label className="grid gap-1 text-xs">
          Tipo
          <select name="kind" defaultValue={set.kind} className={field}>
            <option value="always_on">Always on</option>
            <option value="special">Especial</option>
            <option value="off">Apagada</option>
          </select>
        </label>
        <label className="grid gap-1 text-xs">
          Vigencia
          <input name="windowLabel" defaultValue={set.windowLabel} className={field} placeholder="Ej. 1/11 – 30/11" />
        </label>
        <label className="grid gap-1 text-xs">
          Qué comunicamos
          <textarea name="message" defaultValue={set.message} rows={3} className={field} />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-xs">
            $/día
            <input name="dailyBudget" defaultValue={set.dailyBudget ?? ""} inputMode="numeric" className={field} />
          </label>
          <label className="grid gap-1 text-xs">
            Días
            <input name="days" defaultValue={set.days} inputMode="numeric" className={field} />
          </label>
        </div>
        <label className="grid gap-1 text-xs">
          WhatsApp
          <input name="whatsapp" defaultValue={set.whatsapp} className={field} placeholder="Ej. Fede (maquinaria)" />
        </label>
        <label className="grid gap-1 text-xs">
          Marcas
          <input name="brands" defaultValue={set.brands} className={field} />
        </label>
        <label className="grid gap-1 text-xs">
          Anuncios previstos
          <input name="adsLabel" defaultValue={set.adsLabel} className={field} placeholder="Ej. 4: Precio · Credicoop · Bancor · Santander" />
        </label>
        <label className="grid gap-1 text-xs">
          Zona y público
          <textarea name="zoneNote" defaultValue={set.zoneNote} rows={3} className={field} />
        </label>
        <button type="submit" className="mt-2 w-fit rounded-full bg-[#4f6f52] px-4 py-2 text-sm text-[#f7f5f0]">
          {set.id ? "Guardar" : "Crear"}
        </button>
      </form>
    </Drawer>
  );
}

function AdDrawer({
  ad,
  setId,
  client,
  view,
  onClose,
}: {
  ad: PlanAd | null;
  setId: string;
  client: OpsClient;
  view: string;
  onClose: () => void;
}) {
  return (
    <Drawer kicker="Anuncio" title={ad ? "Editar anuncio" : "Nuevo anuncio"} onClose={onClose}>
      <form action={saveOpsAdAction} className="grid gap-3">
        <input type="hidden" name="id" value={ad?.id ?? ""} />
        <input type="hidden" name="setId" value={setId} />
        <input type="hidden" name="clientSlug" value={client.slug} />
        <input type="hidden" name="view" value={view} />
        <label className="grid gap-1 text-xs">
          Anuncio
          <input name="name" required defaultValue={ad?.name ?? ""} autoFocus className={field} placeholder="Ej. Precio" />
        </label>
        <label className="grid gap-1 text-xs">
          Ángulo
          <input name="angle" defaultValue={ad?.angle ?? ""} className={field} placeholder="Ej. Precio" />
        </label>
        <label className="grid gap-1 text-xs">
          Qué dice
          <textarea name="body" defaultValue={ad?.body ?? ""} rows={4} className={field} />
        </label>
        <label className="grid gap-1 text-xs">
          Mensaje precargado
          <input name="prefilled" defaultValue={ad?.prefilled ?? ""} className={field} placeholder="Ej. Hola, quiero info" />
        </label>
        <button type="submit" className="mt-2 w-fit rounded-full bg-[#4f6f52] px-4 py-2 text-sm text-[#f7f5f0]">
          {ad ? "Guardar" : "Crear"}
        </button>
      </form>
    </Drawer>
  );
}

type DeliverMode = "urgente" | "indefinido" | "fecha" | "antes";

function isoDay(day: string, month: string, year?: string) {
  let full = year ?? String(new Date().getFullYear());
  if (full.length === 2) full = `20${full}`;
  return `${full}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function parseDeliver(value: string) {
  const text = value.trim();
  if (/^urgente$/i.test(text)) return { mode: "urgente" as DeliverMode, date: "" };
  if (/^indefinido$/i.test(text) || /cuando se defina/i.test(text)) return { mode: "indefinido" as DeliverMode, date: "" };
  const antes = text.match(/^antes de(?:l)?\s+(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/i);
  if (antes) return { mode: "antes" as DeliverMode, date: isoDay(antes[1], antes[2], antes[3]) };
  const fecha = text.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?$/);
  if (fecha) return { mode: "fecha" as DeliverMode, date: isoDay(fecha[1], fecha[2], fecha[3]) };
  return { mode: "indefinido" as DeliverMode, date: "" };
}

function DeliveryField({ initial }: { initial: string }) {
  const parsed = parseDeliver(initial);
  const [mode, setMode] = useState<DeliverMode>(parsed.mode);
  const dateRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLLabelElement>(null);
  const needsDate = mode === "fecha" || mode === "antes";

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="grid gap-1 text-xs">
        Entrega
        <select
          name="deliverMode"
          value={mode}
          className={field}
          onChange={(event) => {
            const next = event.target.value as DeliverMode;
            setMode(next);
            const wrap = wrapRef.current;
            const input = dateRef.current;
            const dated = next === "fecha" || next === "antes";
            if (wrap) wrap.hidden = !dated;
            if (input) input.required = dated;
            if (!dated || !input) return;
            try {
              input.showPicker();
            } catch {
              input.focus();
            }
          }}
        >
          <option value="urgente">Urgente</option>
          <option value="indefinido">Indefinido</option>
          <option value="fecha">Fecha</option>
          <option value="antes">Antes de</option>
        </select>
      </label>
      <label ref={wrapRef} hidden={!needsDate} className="grid gap-1 text-xs">
        Fecha
        <input ref={dateRef} type="date" name="deliverOn" defaultValue={parsed.date} required={needsDate} className={field} />
      </label>
    </div>
  );
}

function CreativeDrawer({
  item,
  client,
  view,
  onClose,
}: {
  item: PlanCreative | null;
  client: OpsClient;
  view: string;
  onClose: () => void;
}) {
  if (!item) return null;
  return (
    <Drawer kicker={item.campaignLabel || "Creativo"} title="Editar creativo" onClose={onClose}>
      <form action={saveOpsCreativeAction} className="grid gap-3">
        <input type="hidden" name="id" value={item.id} />
        <input type="hidden" name="clientSlug" value={client.slug} />
        <input type="hidden" name="view" value={view} />
        <label className="grid gap-1 text-xs">
          Anuncio
          <input name="adName" required defaultValue={item.adName} autoFocus className={field} />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-xs">
            Campaña
            <input name="campaignLabel" defaultValue={item.campaignLabel} className={field} />
          </label>
          <label className="grid gap-1 text-xs">
            Conjunto
            <input name="adSetName" defaultValue={item.adSetName} className={field} />
          </label>
          <label className="grid gap-1 text-xs">
            Para
            <input name="dueLabel" defaultValue={item.dueLabel} className={field} placeholder="Ej. 1/11" />
          </label>
        </div>
        <DeliveryField initial={item.deliverLabel} />
        <label className="grid gap-1 text-xs">
          Qué dice
          <textarea name="copy" defaultValue={item.copy} rows={4} className={field} />
        </label>
        <label className="grid gap-1 text-xs">
          Material necesario
          <textarea name="material" defaultValue={item.material} rows={2} className={field} />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-xs">
            Imagen 4:5
            <input name="imageFeed" defaultValue={item.imageFeed} inputMode="numeric" className={field} />
          </label>
          <label className="grid gap-1 text-xs">
            Imagen 9:16
            <input name="imageStory" defaultValue={item.imageStory} inputMode="numeric" className={field} />
          </label>
          <label className="grid gap-1 text-xs">
            Video 9:16
            <input name="videoStory" defaultValue={item.videoStory} inputMode="numeric" className={field} />
          </label>
          <label className="grid gap-1 text-xs">
            Video 4:5
            <input name="videoFeed" defaultValue={item.videoFeed} inputMode="numeric" className={field} />
          </label>
        </div>
        <button type="submit" className="mt-2 w-fit rounded-full bg-[#4f6f52] px-4 py-2 text-sm text-[#f7f5f0]">
          Guardar
        </button>
      </form>
    </Drawer>
  );
}

function AudienceDrawer({
  campaign,
  client,
  view,
  onClose,
}: {
  campaign: PlanCampaign | null;
  client: OpsClient;
  view: string;
  onClose: () => void;
}) {
  if (!campaign) return null;
  return (
    <Drawer kicker={campaign.label || campaign.name} title="Editar público" onClose={onClose}>
      <form action={saveOpsAudienceAction} className="grid gap-3">
        <input type="hidden" name="campaignId" value={campaign.id} />
        <input type="hidden" name="clientSlug" value={client.slug} />
        <input type="hidden" name="view" value={view} />
        <label className="grid gap-1 text-xs">
          Zona
          <textarea name="zone" defaultValue={campaign.audience?.zone ?? ""} rows={2} className={field} />
        </label>
        <label className="grid gap-1 text-xs">
          A quién le hablamos
          <textarea name="who" defaultValue={campaign.audience?.who ?? ""} rows={3} className={field} />
        </label>
        <label className="grid gap-1 text-xs">
          Excluir
          <textarea name="exclude" defaultValue={campaign.audience?.exclude ?? ""} rows={2} className={field} />
        </label>
        <button type="submit" className="mt-2 w-fit rounded-full bg-[#4f6f52] px-4 py-2 text-sm text-[#f7f5f0]">
          Guardar
        </button>
      </form>
    </Drawer>
  );
}
