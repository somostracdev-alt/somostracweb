"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { localeCookie, type Locale } from "@/lib/locale";

export async function setLocaleAction(formData: FormData) {
  const locale: Locale = String(formData.get("locale")) === "en" ? "en" : "es";
  const store = await cookies();
  store.set(localeCookie, locale, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });
  revalidatePath("/", "layout");
}
