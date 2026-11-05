"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { isAdminAuthenticated } from "@/lib/admin-session";
import { createOpsClient, createOpsPiece, deleteOpsPiece, updateOpsPiece } from "@/lib/ops/queries";

function text(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function pieceInput(formData: FormData) {
  return {
    publishOn: text(formData, "publishOn"),
    timeLabel: text(formData, "timeLabel"),
    account: text(formData, "account"),
    format: text(formData, "format"),
    pillar: text(formData, "pillar"),
    status: text(formData, "status"),
    theme: text(formData, "theme"),
    material: text(formData, "material"),
    copy: text(formData, "copy"),
    brief: text(formData, "brief"),
    cta: text(formData, "cta"),
    owner: text(formData, "owner"),
  };
}

function backTo(formData: FormData) {
  const client = text(formData, "clientSlug") || "gallagro";
  const month = text(formData, "month") || "";
  return month ? `/ops?client=${encodeURIComponent(client)}&month=${encodeURIComponent(month)}` : `/ops?client=${encodeURIComponent(client)}`;
}

async function guard() {
  if (!(await isAdminAuthenticated())) {
    redirect("/login?next=/ops");
  }
}

export async function createOpsClientAction(formData: FormData) {
  await guard();
  const name = text(formData, "name");
  const account = text(formData, "account");
  const destination = text(formData, "destination");
  const month = text(formData, "month");
  const surface = text(formData, "surface");
  const fallback = text(formData, "clientSlug") || "gallagro";
  const back = surface === "pauta"
    ? `/ops/pauta?client=${encodeURIComponent(fallback)}`
    : month
      ? `/ops?client=${encodeURIComponent(fallback)}&month=${encodeURIComponent(month)}`
      : `/ops?client=${encodeURIComponent(fallback)}`;
  let created;
  try {
    created = await createOpsClient(name, account, destination);
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo crear el cliente.";
    redirect(`${back}&error=${encodeURIComponent(message)}`);
  }
  revalidatePath("/ops");
  revalidatePath("/ops/pauta");
  const next = surface === "pauta"
    ? `/ops/pauta?client=${encodeURIComponent(created.slug)}`
    : month
      ? `/ops?client=${encodeURIComponent(created.slug)}&month=${encodeURIComponent(month)}`
      : `/ops?client=${encodeURIComponent(created.slug)}`;
  redirect(`${next}&ok=${encodeURIComponent("Cliente creado.")}`);
}

export async function saveOpsPieceAction(formData: FormData) {
  await guard();
  const id = text(formData, "id");
  const clientId = text(formData, "clientId");
  const input = pieceInput(formData);
  if (!input.publishOn) {
    redirect(`${backTo(formData)}&error=${encodeURIComponent("Falta la fecha.")}`);
  }
  try {
    if (id) await updateOpsPiece(id, input);
    else await createOpsPiece(clientId, input);
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo guardar.";
    redirect(`${backTo(formData)}&error=${encodeURIComponent(message)}`);
  }
  revalidatePath("/ops");
  redirect(`${backTo(formData)}&ok=${encodeURIComponent("Pieza guardada.")}`);
}

export async function deleteOpsPieceAction(formData: FormData) {
  await guard();
  const id = text(formData, "id");
  try {
    if (id) await deleteOpsPiece(id);
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo borrar.";
    redirect(`${backTo(formData)}&error=${encodeURIComponent(message)}`);
  }
  revalidatePath("/ops");
  redirect(`${backTo(formData)}&ok=${encodeURIComponent("Pieza borrada.")}`);
}
