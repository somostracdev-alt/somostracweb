"use client";

import { useState } from "react";

import type { SiteContent } from "@/content/site";

export function ContactForm({ site }: { site: SiteContent }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = `Nombre: ${name}\nEmail: ${email}\n\n${message}`;
    const mailto = `mailto:${site.contact.email}?subject=${encodeURIComponent("Contacto web TRAC")}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setSent(true);
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <label className="grid gap-2 text-sm font-light">
        {site.contactPage.nameLabel}
        <input
          required
          name="nombre"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="border border-white/20 bg-transparent px-3 py-3 text-base text-white outline-none focus:border-accent"
        />
      </label>
      <label className="grid gap-2 text-sm font-light">
        {site.contactPage.emailLabel}
        <input
          required
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="border border-white/20 bg-transparent px-3 py-3 text-base text-white outline-none focus:border-accent"
        />
      </label>
      <label className="grid gap-2 text-sm font-light">
        {site.contactPage.messageLabel}
        <textarea
          required
          name="mensaje"
          rows={6}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="border border-white/20 bg-transparent px-3 py-3 text-base text-white outline-none focus:border-accent"
        />
      </label>
      <button
        type="submit"
        className="justify-self-start border border-accent bg-black px-[15px] py-2 font-sans text-base font-semibold uppercase tracking-[1px] text-white transition-colors hover:border-white hover:bg-white hover:text-black"
      >
        {site.contactPage.submitLabel}
      </button>
      {sent ? (
        <p className="text-sm font-light text-accent">
          Se abrió tu correo para enviar el mensaje a {site.contact.email}.
        </p>
      ) : null}
    </form>
  );
}
