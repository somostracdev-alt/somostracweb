"use client";

import { FormEvent, useState } from "react";

import type { SiteContent } from "@/content/site";
import { uiCopy, type Locale } from "@/lib/locale";

function withMessage(href: string, text: string) {
  const url = new URL(href, "https://wa.me");
  if (text) url.searchParams.set("text", text);
  return url.toString();
}

export function ContactForm({ site, locale }: { site: SiteContent; locale: Locale }) {
  const [sent, setSent] = useState(false);
  const copy = uiCopy[locale];
  const labels = site.contactPage;

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const nombre = String(data.get("nombre") || "").trim();
    const email = String(data.get("email") || "").trim();
    const telefono = String(data.get("telefono") || "").trim();
    const mensaje = String(data.get("mensaje") || "").trim();
    const text = copy.formMessage(nombre, email, telefono, mensaje);
    window.open(withMessage(site.contact.whatsappHref, text), "_blank", "noopener,noreferrer");
    setSent(true);
  }

  return (
    <form onSubmit={onSubmit} className="border border-line bg-surface p-8 md:p-12">
      <p className="page-kicker">{copy.formKicker}</p>
      <div className="space-y-8">
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{labels.nameLabel}</span>
          <input
            required
            name="nombre"
            type="text"
            autoComplete="name"
            className="mt-2 w-full border-0 border-b border-line bg-transparent px-0 py-2.5 text-lg text-foreground outline-none focus:border-accent"
          />
        </label>
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{labels.emailLabel}</span>
          <input
            required
            name="email"
            type="email"
            autoComplete="email"
            className="mt-2 w-full border-0 border-b border-line bg-transparent px-0 py-2.5 text-lg text-foreground outline-none focus:border-accent"
          />
        </label>
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{labels.phoneLabel}</span>
          <input
            required
            name="telefono"
            type="tel"
            autoComplete="tel"
            className="mt-2 w-full border-0 border-b border-line bg-transparent px-0 py-2.5 text-lg text-foreground outline-none focus:border-accent"
          />
        </label>
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{labels.messageLabel}</span>
          <textarea
            required
            name="mensaje"
            rows={4}
            className="mt-2 w-full resize-y border-0 border-b border-line bg-transparent px-0 py-2.5 text-lg leading-8 text-foreground outline-none focus:border-accent"
          />
        </label>
      </div>
      <button
        type="submit"
        className="mt-10 bg-accent px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-black hover:bg-foreground hover:text-background"
      >
        {labels.submitLabel}
      </button>
      {sent ? (
        <p className="mt-4 text-sm font-light text-muted">
          {copy.formSent}
        </p>
      ) : null}
    </form>
  );
}
