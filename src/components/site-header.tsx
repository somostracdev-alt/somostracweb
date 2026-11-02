"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import type { SiteContent } from "@/content/site";
import { SocialLinks } from "@/components/social-links";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader({
  site,
  themeLightLabel,
  themeDarkLabel,
  menuOpenLabel,
  menuCloseLabel,
}: {
  site: SiteContent;
  themeLightLabel: string;
  themeDarkLabel: string;
  menuOpenLabel: string;
  menuCloseLabel: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const transparent = scrolled && !open;

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
      className={`sticky top-0 z-40 w-full transition-[background-color,backdrop-filter] duration-300 ${
        transparent ? "bg-[var(--header-scrolled)] backdrop-blur-md" : "bg-background"
      }`}
    >
      <div className="mx-auto grid w-full max-w-[1180px] grid-cols-3 items-center px-6 py-5 sm:px-10 md:py-6 lg:px-12">
        <SocialLinks links={site.social} />
        <Link href="/" className="justify-self-center" aria-label={site.brand.name}>
          <Image
            src={site.brand.logo}
            alt={site.brand.name}
            width={482}
            height={128}
            priority
            className="brand-logo h-9 w-auto md:h-11"
          />
        </Link>
        <div className="flex items-center justify-self-end gap-1">
          <ThemeToggle lightLabel={themeLightLabel} darkLabel={themeDarkLabel} />
          <button
            type="button"
            className="text-foreground transition-colors hover:text-accent"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? menuCloseLabel : menuOpenLabel}
            onClick={() => setOpen((current) => !current)}
          >
          {open ? (
            <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
              <path
                d="M4 7h16M4 12h16M4 17h16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              />
            </svg>
          )}
        </button>
        </div>
      </div>

      {open ? (
        <div className="w-full overflow-hidden">
          <div id="site-menu" className="animate-[trac-menu_0.45s_ease] bg-foreground">
            <nav
              aria-label="Menu"
              className="flex w-full flex-col items-center gap-1 py-6 md:flex-row md:justify-center md:gap-16 md:py-5"
            >
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
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
