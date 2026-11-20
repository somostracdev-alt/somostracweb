"use client";

import { FormEvent, useState } from "react";

import type { SiteContent } from "@/content/site";
import { uiCopy, type Locale } from "@/lib/locale";

function withMessage(href: string, text: string) {
  const url = new URL(href, "https://wa.me");
  if (text) url.searchParams.set("text", text);
  return url.toString();
}

const fieldClass =
  "mt-2 w-full border-0 border-b border-line bg-transparent px-0 py-2.5 text-base text-foreground outline-none focus:border-accent";

export function ContactForm({ site, locale }: { site: SiteContent; locale: Locale }) {
  const [sent, setSent] = useState(false);
  const copy = uiCopy[locale];
  const labels = site.contactPage;

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const nombre = String(data.get("nombre") || "").trim();
    const empresa = String(data.get("empresa") || "").trim();
    const rubro = String(data.get("rubro") || "").trim();
    const whatsapp = String(data.get("whatsapp") || "").trim();
    const email = String(data.get("email") || "").trim();
    const zona = String(data.get("zona") || "").trim();
    const mensaje = String(data.get("mensaje") || "").trim();
    const text = copy.formMessage({ nombre, empresa, rubro, whatsapp, email, zona, mensaje });
    window.open(withMessage(site.contact.whatsappHref, text), "_blank", "noopener,noreferrer");
    setSent(true);
  }

  return (
    <form onSubmit={onSubmit} className="border border-line bg-surface p-8 md:p-12">
      <p className="page-kicker">{copy.formKicker}</p>
      <div className="space-y-8">
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
            {labels.nameLabel} *
          </span>
          <input required name="nombre" type="text" autoComplete="name" className={fieldClass} />
        </label>
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
            {labels.companyLabel} *
          </span>
          <input required name="empresa" type="text" autoComplete="organization" className={fieldClass} />
        </label>
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
            {labels.sectorLabel} *
          </span>
          <select required name="rubro" defaultValue="" className={fieldClass}>
            <option value="" disabled>
              {labels.sectorLabel}
            </option>
            {labels.sectors.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
            {labels.whatsappLabel} *
          </span>
          <input required name="whatsapp" type="tel" autoComplete="tel" className={fieldClass} />
        </label>
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
            {labels.emailLabel} *
          </span>
          <input required name="email" type="email" autoComplete="email" className={fieldClass} />
        </label>
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{labels.zoneLabel}</span>
          <input name="zona" type="text" autoComplete="address-level1" className={fieldClass} />
        </label>
        <label className="block">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{labels.messageLabel}</span>
          <textarea
            name="mensaje"
            rows={4}
            placeholder={labels.messagePlaceholder}
            className={`${fieldClass} resize-y leading-7 placeholder:text-muted`}
          />
        </label>
      </div>
      <button
        type="submit"
        className="mt-10 bg-accent px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-black hover:bg-[#161616] hover:text-white"
      >
        {labels.submitLabel}
      </button>
      <p className="mt-4 text-sm leading-6 text-muted">{labels.privacy}</p>
      {sent ? <p className="mt-4 text-sm leading-6 text-foreground">{labels.success}</p> : null}
    </form>
  );
}
