"use client";

import { FormEvent, useEffect, useState } from "react";

type WhatsAppCopy = {
  greeting: string;
  bubble: string;
  open: string;
  close: string;
  label: string;
  role: string;
  messageLabel: string;
};

function WhatsappLogo({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`fill-current ${className}`} aria-hidden="true">
      <path d="M20.5 3.5A11 11 0 0 0 2.1 16.8L1 23l6.4-1.1A11 11 0 0 0 20.5 3.5zm-8.5 17a9.1 9.1 0 0 1-4.6-1.3l-.3-.2-3.8.6.6-3.7-.2-.3A9.1 9.1 0 1 1 12 20.5zm5-6.8c-.3-.1-1.6-.8-1.8-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.6.1a7.4 7.4 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.5.2-.3a.5.5 0 0 0 0-.5c0-.1-.6-1.4-.8-1.9s-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 12 12 0 0 0 4.5 4 15 15 0 0 0 1.5.5 3.6 3.6 0 0 0 1.7.1 2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .2-1.2c-.1-.1-.3-.2-.6-.3z" />
    </svg>
  );
}

function withMessage(href: string, text: string) {
  const url = new URL(href, "https://wa.me");
  if (text) url.searchParams.set("text", text);
  return url.toString();
}

export function WhatsAppButton({
  href,
  lifted = false,
  copy,
}: {
  href: string;
  lifted?: boolean;
  copy: WhatsAppCopy;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = String(new FormData(event.currentTarget).get("mensaje") ?? "").trim();
    window.open(withMessage(href, text || copy.greeting), "_blank", "noopener,noreferrer");
    setOpen(false);
  }

  return (
    <div
      className={`fixed right-5 z-40 flex flex-col items-end gap-3 transition-[bottom] duration-300 motion-reduce:transition-none ${
        lifted ? "bottom-20" : "bottom-5"
      }`}
    >
      {open ? (
        <div
          role="dialog"
          aria-label={copy.label}
          className="w-[min(22rem,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-white/15 bg-black text-white shadow-[0_18px_50px_rgba(0,0,0,0.45)]"
        >
          <div className="flex items-center gap-3 bg-[#06AF53] px-4 py-3 text-black">
            <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full bg-black font-display text-xl text-white">
              T
              <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-[#06AF53] bg-[#25D366]" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-xl leading-none">TRAC</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-black/70">
                {copy.role}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={copy.close}
              className="grid h-8 w-8 place-items-center text-xl leading-none text-black/70 hover:text-black"
            >
              ×
            </button>
          </div>
          <div className="px-4 py-5">
            <p className="max-w-[85%] rounded-xl bg-white px-3 py-2 text-sm leading-relaxed text-[#383838]">
              {copy.bubble}
            </p>
          </div>
          <form onSubmit={onSubmit} className="border-t border-white/10 bg-black p-3">
            <label className="sr-only" htmlFor="wa-mensaje">
              {copy.messageLabel}
            </label>
            <textarea
              id="wa-mensaje"
              name="mensaje"
              rows={3}
              defaultValue={copy.greeting}
              className="w-full resize-none rounded-xl border border-white/20 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-accent"
            />
            <button
              type="submit"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white hover:bg-[#1ebe5b]"
            >
              <WhatsappLogo className="h-4 w-4" />
              {copy.open}
            </button>
          </form>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? copy.close : copy.label}
        className="grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-300 hover:scale-105 motion-reduce:transition-none"
      >
        <WhatsappLogo className="h-7 w-7" />
      </button>
    </div>
  );
}
