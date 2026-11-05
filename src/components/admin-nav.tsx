"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

import { logoutAdminAction } from "@/app/login/actions";

const visualLinks = [
  { href: "/admin/contacto", label: "Contacto" },
  { href: "/admin/inicio", label: "Inicio" },
  { href: "/admin/quienes-somos", label: "Quiénes somos" },
  { href: "/admin/servicios", label: "Servicios" },
  { href: "/admin/sitio", label: "Menú y footer" },
];

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-xl px-3 py-2 text-sm ${active ? "bg-accent text-white" : "hover:bg-accent/10"}`}
    >
      {label}
    </Link>
  );
}

function NavGroup({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <details
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
      className="group"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-black/50 [&::-webkit-details-marker]:hidden">
        {title}
        <svg className="h-3.5 w-3.5 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.58l3.3-3.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.42Z" />
        </svg>
      </summary>
      <div className="mt-1 flex flex-col gap-1">{children}</div>
    </details>
  );
}

export function AdminNav() {
  const pathname = usePathname();
  const visualOpen = visualLinks.some((link) => pathname.startsWith(link.href)) || pathname === "/admin";

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-black/10 bg-neutral-50">
      <Link href="/admin" className="px-5 py-6">
        <p className="text-xs font-semibold uppercase tracking-[3px] text-black/50">TRAC</p>
        <p className="mt-1 text-lg font-semibold">Admin</p>
      </Link>
      <nav className="flex flex-1 flex-col gap-4 px-3">
        <NavGroup title="Visual" defaultOpen={visualOpen}>
          {visualLinks.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} active={pathname.startsWith(link.href)} />
          ))}
        </NavGroup>
        <NavGroup title="Planificación" defaultOpen>
          <a
            href="/ops"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl px-3 py-2 text-sm hover:bg-accent/10"
          >
            Calendario
          </a>
        </NavGroup>
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
