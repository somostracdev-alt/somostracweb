"use server";

import { redirect } from "next/navigation";

import { loginAsAdmin, logoutAdmin } from "@/lib/admin-session";

export async function loginAdminAction(formData: FormData) {
  const identifier = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!identifier || !password) {
    redirect("/login?error=" + encodeURIComponent("Completá usuario y contraseña"));
  }

  if (!process.env.ADMIN_PASSWORD) {
    redirect(
      "/login?error=" +
        encodeURIComponent("Falta ADMIN_PASSWORD en .env.local (o en las variables del hosting)."),
    );
  }

  if (identifier !== "admin") {
    redirect("/login?error=" + encodeURIComponent("Credenciales inválidas"));
  }

  const ok = await loginAsAdmin(password);
  if (!ok) {
    redirect("/login?error=" + encodeURIComponent("Credenciales inválidas"));
  }

  redirect("/admin");
}

export async function logoutAdminAction() {
  await logoutAdmin();
  redirect("/login");
}
