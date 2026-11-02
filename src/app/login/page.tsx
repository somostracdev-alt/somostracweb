import Link from "next/link";
import { redirect } from "next/navigation";

import { loginAdminAction } from "./actions";
import { isAdminAuthenticated } from "@/lib/admin-session";

type SearchParams = Promise<{ error?: string; aviso?: string }>;

export const instant = false;

export const metadata = {
  title: "Iniciar sesión",
};

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-white text-[#383838]">
      <div className="mx-auto w-full max-w-md px-6 py-10">
        <div className="mb-8 space-y-3">
          <h1 className="text-4xl font-semibold">Iniciar sesión</h1>
          <p className="text-black/70">Entrá con el usuario admin y la contraseña del panel.</p>
        </div>

        {params.aviso ? (
          <p className="mb-4 rounded-xl bg-amber-100 px-4 py-2 text-sm text-amber-950">{params.aviso}</p>
        ) : null}
        {params.error ? (
          <p className="mb-4 rounded-xl bg-red-100 px-4 py-2 text-sm text-red-950">{params.error}</p>
        ) : null}

        <form action={loginAdminAction} className="space-y-4 rounded-2xl border border-black/10 p-6">
          <label className="grid gap-1 text-sm">
            Usuario
            <input
              name="email"
              type="text"
              required
              autoComplete="username"
              defaultValue="admin"
              className="rounded-xl border border-black/20 px-4 py-2"
            />
          </label>
          <label className="grid gap-1 text-sm">
            Contraseña
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="rounded-xl border border-black/20 px-4 py-2"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-full bg-black px-5 py-2 text-sm uppercase tracking-wide text-white"
          >
            Entrar
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          <Link href="/" className="underline">
            Volver al sitio
          </Link>
        </p>
      </div>
    </div>
  );
}
