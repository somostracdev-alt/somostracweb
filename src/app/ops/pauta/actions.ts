"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { isAdminAuthenticated } from "@/lib/admin-session";
import {
  createOpsAd,
  createOpsAdSet,
  deleteOpsAd,
  deleteOpsAdSet,
  deleteOpsCampaign,
  saveOpsAudience,
  setOpsPlanNoteDone,
  updateOpsCreative,
  updateOpsAd,
  updateOpsAdSet,
  saveOpsCampaignSpan,
} from "@/lib/ops/plan-queries";

function text(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function backTo(formData: FormData) {
  const client = text(formData, "clientSlug") || "gallagro";
  const view = text(formData, "view") || currentMonth();
  return `/ops/pauta?client=${encodeURIComponent(client)}&view=${encodeURIComponent(view)}`;
}

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function monthDate(view: string) {
  const month = /^\d{4}-\d{2}$/.test(view) ? view : currentMonth();
  return `${month}-01`;
}

async function guard() {
  if (!(await isAdminAuthenticated())) {
    redirect("/login?next=/ops/pauta");
  }
}

function money(value: string) {
  if (!value || value === "—" || value === "-") return null;
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) return null;
  return Number(digits);
}

function adSetInput(formData: FormData) {
  return {
    name: text(formData, "name"),
    kind: text(formData, "kind"),
    windowLabel: text(formData, "windowLabel"),
    message: text(formData, "message"),
    adsLabel: text(formData, "adsLabel"),
    brands: text(formData, "brands"),
    zoneNote: text(formData, "zoneNote"),
    whatsapp: text(formData, "whatsapp"),
    dailyBudget: money(text(formData, "dailyBudget")),
    days: Number(text(formData, "days")),
  };
}

function adInput(formData: FormData) {
  return {
    name: text(formData, "name"),
    angle: text(formData, "angle"),
    body: text(formData, "body"),
    prefilled: text(formData, "prefilled"),
  };
}

function fail(back: string, error: unknown, fallback: string): never {
  const message = error instanceof Error ? error.message : fallback;
  redirect(`${back}&error=${encodeURIComponent(message)}`);
}

export async function saveOpsCampaignAction(formData: FormData) {
  await guard();
  const back = backTo(formData);
  const id = text(formData, "id");
  const from = text(formData, "spanFrom");
  const to = text(formData, "spanTo");
  const input = { name: text(formData, "name"), label: text(formData, "label"), from: `${from}-01`, to: `${to}-01` };
  try {
    if (!/^\d{4}-\d{2}$/.test(from) || !/^\d{4}-\d{2}$/.test(to)) throw new Error("Elegí desde qué mes hasta qué mes.");
    await saveOpsCampaignSpan(text(formData, "clientId"), id, input);
  } catch (error) {
    fail(back, error, "No se pudo guardar la campaña.");
  }
  revalidatePath("/ops/pauta");
  const client = text(formData, "clientSlug") || "gallagro";
  const view = text(formData, "view");
  const stay = /^\d{4}-\d{2}$/.test(view) && view >= from && view <= to;
  const nextView = !id || !stay ? from : view;
  const next = `/ops/pauta?client=${encodeURIComponent(client)}&view=${encodeURIComponent(nextView)}`;
  redirect(`${next}&ok=${encodeURIComponent(id ? "Campaña guardada." : "Campaña creada.")}`);
}

export async function deleteOpsCampaignAction(formData: FormData) {
  await guard();
  const back = backTo(formData);
  try {
    await deleteOpsCampaign(text(formData, "id"));
  } catch (error) {
    fail(back, error, "No se pudo eliminar la campaña.");
  }
  revalidatePath("/ops/pauta");
  redirect(`${back}&ok=${encodeURIComponent("Campaña eliminada.")}`);
}

export async function saveOpsAdSetAction(formData: FormData) {
  await guard();
  const back = backTo(formData);
  const id = text(formData, "id");
  const input = adSetInput(formData);
  try {
    if (id) await updateOpsAdSet(id, input);
    else await createOpsAdSet(text(formData, "campaignId"), monthDate(text(formData, "view")), input);
  } catch (error) {
    fail(back, error, "No se pudo guardar el conjunto.");
  }
  revalidatePath("/ops/pauta");
  redirect(`${back}&ok=${encodeURIComponent(id ? "Conjunto guardado." : "Conjunto creado.")}`);
}

export async function deleteOpsAdSetAction(formData: FormData) {
  await guard();
  const back = backTo(formData);
  try {
    await deleteOpsAdSet(text(formData, "id"));
  } catch (error) {
    fail(back, error, "No se pudo eliminar el conjunto.");
  }
  revalidatePath("/ops/pauta");
  redirect(`${back}&ok=${encodeURIComponent("Conjunto eliminado.")}`);
}

export async function saveOpsAdAction(formData: FormData) {
  await guard();
  const back = backTo(formData);
  const id = text(formData, "id");
  const input = adInput(formData);
  try {
    if (id) await updateOpsAd(id, input);
    else await createOpsAd(text(formData, "setId"), input);
  } catch (error) {
    fail(back, error, "No se pudo guardar el anuncio.");
  }
  revalidatePath("/ops/pauta");
  redirect(`${back}&ok=${encodeURIComponent(id ? "Anuncio guardado." : "Anuncio creado.")}`);
}

export async function deleteOpsAdAction(formData: FormData) {
  await guard();
  const back = backTo(formData);
  try {
    await deleteOpsAd(text(formData, "id"));
  } catch (error) {
    fail(back, error, "No se pudo eliminar el anuncio.");
  }
  revalidatePath("/ops/pauta");
  redirect(`${back}&ok=${encodeURIComponent("Anuncio eliminado.")}`);
}

function count(value: string) {
  if (!value) return 0;
  return Number(value);
}

function dueDate(label: string, view: string) {
  const match = label.match(/^(\d{1,2})\/(\d{1,2})$/);
  if (!match) return null;
  const year = /^\d{4}/.test(view) ? view.slice(0, 4) : String(new Date().getFullYear());
  return `${year}-${match[2].padStart(2, "0")}-${match[1].padStart(2, "0")}`;
}

function deliverChoice(mode: string, iso: string) {
  if (mode === "urgente") return "Urgente";
  if (mode === "indefinido") return "Indefinido";
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) throw new Error("Falta la fecha de entrega.");
  const shown = `${Number(match[3])}/${Number(match[2])}/${match[1]}`;
  if (mode === "fecha") return shown;
  if (mode === "antes") return `Antes del ${shown}`;
  throw new Error("La entrega no es válida.");
}

export async function saveOpsCreativeAction(formData: FormData) {
  await guard();
  const back = backTo(formData);
  const dueLabel = text(formData, "dueLabel");
  try {
    await updateOpsCreative(text(formData, "id"), {
      dueOn: dueDate(dueLabel, text(formData, "view")),
      dueLabel,
      campaignLabel: text(formData, "campaignLabel"),
      adSetName: text(formData, "adSetName"),
      adName: text(formData, "adName"),
      imageFeed: count(text(formData, "imageFeed")),
      imageStory: count(text(formData, "imageStory")),
      videoStory: count(text(formData, "videoStory")),
      videoFeed: count(text(formData, "videoFeed")),
      copy: text(formData, "copy"),
      material: text(formData, "material"),
      deliverLabel: deliverChoice(text(formData, "deliverMode"), text(formData, "deliverOn")),
    });
  } catch (error) {
    fail(back, error, "No se pudo guardar el creativo.");
  }
  revalidatePath("/ops/pauta");
  redirect(`${back}&ok=${encodeURIComponent("Creativo guardado.")}`);
}

export async function saveOpsAudienceAction(formData: FormData) {
  await guard();
  const back = backTo(formData);
  try {
    await saveOpsAudience(text(formData, "campaignId"), {
      zone: text(formData, "zone"),
      who: text(formData, "who"),
      exclude: text(formData, "exclude"),
    });
  } catch (error) {
    fail(back, error, "No se pudo guardar el público.");
  }
  revalidatePath("/ops/pauta");
  redirect(`${back}&ok=${encodeURIComponent("Público guardado.")}`);
}

export async function toggleOpsPlanNoteAction(formData: FormData) {
  await guard();
  const back = backTo(formData);
  try {
    await setOpsPlanNoteDone(text(formData, "id"), text(formData, "done") === "1");
  } catch (error) {
    fail(back, error, "No se pudo actualizar el pendiente.");
  }
  revalidatePath("/ops/pauta");
  redirect(back);
}
