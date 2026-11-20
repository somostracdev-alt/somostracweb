"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import type { SiteContent } from "@/content/site";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader({
  site,
  talkLabel,
  themeLightLabel,
  themeDarkLabel,
  menuOpenLabel,
  menuCloseLabel,
}: {
  site: SiteContent;
  talkLabel: string;
  themeLightLabel: string;
  themeDarkLabel: string;
  menuOpenLabel: string;
  menuCloseLabel: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const next = window.scrollY > 8;
      setScrolled((current) => (current === next ? current : next));
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-background ${scrolled && !open ? "border-b border-line" : ""}`}
    >
      <div className="mx-auto flex w-full max-w-[1180px] items-center gap-6 px-6 py-5 sm:px-10 md:py-6 lg:px-12">
        <Link href="/" className="shrink-0" aria-label={site.brand.name}>
          <Image
            src={site.brand.logo}
            alt={site.brand.name}
            width={482}
            height={128}
            priority
            className="brand-logo h-9 w-auto md:h-11"
          />
        </Link>
        <nav aria-label="Menu" className="hidden flex-1 items-center justify-center gap-8 md:flex">
          {site.navigation.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.id}
                href={link.href}
                className={`whitespace-nowrap font-sans text-sm font-normal transition-colors hover:text-accent ${
                  active ? "text-accent" : "text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <ThemeToggle lightLabel={themeLightLabel} darkLabel={themeDarkLabel} />
          <Link
            href="/contacto"
            className="ml-2 hidden bg-accent px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-black transition-colors hover:bg-[#161616] hover:text-white md:inline-flex"
          >
            {talkLabel}
          </Link>
          <button
            type="button"
            className="text-foreground transition-colors hover:text-accent md:hidden"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? menuCloseLabel : menuOpenLabel}
            onClick={() => setOpen((current) => !current)}
          >
            {open ? (
              <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open ? (
        <div className="w-full overflow-hidden md:hidden">
          <div id="site-menu" className="animate-[trac-menu_0.45s_ease] bg-foreground">
            <nav aria-label="Menu" className="flex w-full flex-col items-center gap-1 py-6">
              {site.navigation.map((link) => {
                const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.id}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`px-2 py-3 font-sans text-lg font-semibold uppercase tracking-[3.5px] transition-colors hover:text-accent ${
                      active ? "text-accent" : "text-background"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="/contacto"
                onClick={() => setOpen(false)}
                className="mt-3 bg-accent px-5 py-3 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-black"
              >
                {talkLabel}
              </Link>
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
