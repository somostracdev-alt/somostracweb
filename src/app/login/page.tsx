import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { loginAdminAction } from "./actions";
import { isAdminAuthenticated } from "@/lib/admin-session";
import { safeNext } from "@/lib/ops/safe-next";
import { getSiteContent } from "@/lib/site-store";

type SearchParams = Promise<{ error?: string; aviso?: string; next?: string }>;

export const instant = false;

export const metadata = {
  title: "Iniciar sesión",
};

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const next = safeNext(params.next);
  if (await isAdminAuthenticated()) {
    redirect(next || "/admin");
  }
  const site = await getSiteContent();
  const field =
    "mt-1 w-full border-0 border-b border-line bg-transparent px-0 py-2.5 text-foreground outline-none focus:border-accent";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-12">
        <Link href="/" className="mb-10 self-center" aria-label={site.brand.name}>
          <Image
            src={site.brand.logo}
            alt={site.brand.name}
            width={482}
            height={128}
            priority
            className="brand-logo h-10 w-auto"
          />
        </Link>

        <p className="page-kicker">Acceso</p>
        <h1 className="page-heading">Iniciar sesión</h1>
        <p className="mt-4 text-sm font-light leading-7 text-muted">
          Entrá con el usuario admin y la contraseña del panel.
        </p>

        {params.aviso ? (
          <p className="mt-6 border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-foreground">{params.aviso}</p>
        ) : null}
        {params.error ? (
          <p className="mt-6 border border-[#a45b5b]/50 bg-[#a45b5b]/10 px-4 py-3 text-sm text-foreground">
            {params.error}
          </p>
        ) : null}

        <form action={loginAdminAction} className="mt-8 space-y-6 border border-line bg-surface p-6">
          {next ? <input type="hidden" name="next" value={next} /> : null}
          <label className="grid text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Usuario
            <input
              name="email"
              type="text"
              required
              autoComplete="username"
              defaultValue="admin"
              className={field}
            />
          </label>
          <label className="grid text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            Contraseña
            <input name="password" type="password" required autoComplete="current-password" className={field} />
          </label>
          <button
            type="submit"
            className="w-full bg-accent px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-black transition-colors hover:bg-foreground hover:text-background"
          >
            Entrar
          </button>
        </form>

        <p className="mt-8 text-center text-sm">
          <Link href="/" className="text-muted transition-colors hover:text-accent">
            Volver al sitio
          </Link>
        </p>
      </div>
    </div>
  );
}
