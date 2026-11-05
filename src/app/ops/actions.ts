"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { isAdminAuthenticated } from "@/lib/admin-session";
import { createOpsPiece, deleteOpsPiece, updateOpsPiece } from "@/lib/ops/queries";

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
