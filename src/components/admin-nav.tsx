"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { logoutAdminAction } from "@/app/login/actions";

const links = [
  { href: "/admin", label: "Panel" },
  { href: "/admin/contacto", label: "Contacto" },
  { href: "/admin/inicio", label: "Inicio" },
  { href: "/admin/quienes-somos", label: "Quiénes somos" },
  { href: "/admin/servicios", label: "Servicios" },
  { href: "/admin/sitio", label: "Menú y pie" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-black/10 bg-neutral-50">
      <div className="px-5 py-6">
        <p className="text-xs font-semibold uppercase tracking-[3px] text-black/50">TRAC</p>
        <p className="mt-1 text-lg font-semibold">Admin</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {links.map((link) => {
          const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-xl px-3 py-2 text-sm ${active ? "bg-accent text-white" : "hover:bg-accent/10"}`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-2 px-3 py-4">
        <Link href="/" className="block rounded-xl px-3 py-2 text-sm hover:bg-black/5">
          Ver el sitio
        </Link>
        <form action={logoutAdminAction}>
          <button type="submit" className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-black/5">
            Salir
          </button>
        </form>
      </div>
    </aside>
  );
}
