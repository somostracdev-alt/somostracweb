"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { SiteContent } from "@/content/site";
import { SocialLinks } from "@/components/social-links";

function useCompactFooter(footerId: string) {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    let frame = 0;
    let lastY = window.scrollY;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = lastY - y;
      lastY = y;
      const footer = document.getElementById(footerId);
      const footerInView = footer
        ? footer.getBoundingClientRect().top < window.innerHeight - 8
        : false;

      setCompact((current) => {
        if (y < 48 || footerInView) return false;
        if (delta > 6) return true;
        if (delta < -6) return false;
        return current;
      });
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [footerId]);

  return compact;
}

export function SiteFooter({ site }: { site: SiteContent }) {
  const compact = useCompactFooter("site-footer");
  const about = site.navigation.find((link) => link.id === "quienes") ?? {
    id: "quienes",
    label: "Quiénes somos",
    href: "/quienes-somos",
  };

  return (
    <>
      <footer id="site-footer" className="border-t border-white/10 bg-black">
        <div className="grid gap-10 px-5 py-14 md:grid-cols-3 md:px-[8%]">
          <p className="font-display text-2xl uppercase leading-tight tracking-[1px] md:text-3xl">
            {site.footer.tagline}
          </p>
          <div>
            <p className="mb-4 font-sans text-sm font-semibold uppercase tracking-[1px] text-accent">
              {site.footer.linksTitle}
            </p>
            <ul className="space-y-2">
              {site.footer.links.map((link) => (
                <li key={link.id}>
                  <Link href={link.href} className="font-extralight transition-colors hover:text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-4 font-sans text-sm font-semibold uppercase tracking-[1px] text-accent">
              {site.footer.contactTitle}
            </p>
            <ul className="space-y-2 font-extralight">
              <li>
                <a href={`mailto:${site.contact.email}`} className="transition-colors hover:text-accent">
                  {site.contact.email}
                </a>
              </li>
              <li>
                <a href={site.contact.whatsappHref} className="transition-colors hover:text-accent">
                  {site.contact.phoneDisplay}
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <SocialLinks links={site.social} />
            </div>
          </div>
        </div>
        <p className="border-t border-white/10 px-5 py-5 text-center text-sm font-extralight text-white/70 md:px-[8%]">
          {site.footer.copyright}
        </p>
      </footer>

      <div
        inert={!compact}
        aria-hidden={!compact}
        className={`fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-black/75 backdrop-blur-md transition-transform duration-300 motion-reduce:transition-none ${
          compact ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between gap-4 px-5 py-3 md:px-[8%]">
          <Link href="/" aria-label={site.brand.name} className="shrink-0">
            <Image
              src={site.brand.logo}
              alt=""
              width={482}
              height={128}
              className="h-7 w-auto"
            />
          </Link>
          <Link
            href={about.href}
            className="truncate font-sans text-xs font-normal uppercase tracking-[1px] text-white transition-colors hover:text-accent sm:text-sm"
          >
            {about.label}
          </Link>
          <SocialLinks links={site.social} />
        </div>
      </div>

      <WhatsAppButton href={site.contact.whatsappHref} lifted={compact} />
    </>
  );
}

export function WhatsAppButton({ href, lifted = false }: { href: string; lifted?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Escribir por WhatsApp"
      className={`fixed right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-[bottom,transform] duration-300 hover:scale-105 motion-reduce:transition-none ${
        lifted ? "bottom-20" : "bottom-5"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden="true">
        <path d="M20.5 3.5A11 11 0 0 0 2.1 16.8L1 23l6.4-1.1A11 11 0 0 0 20.5 3.5zm-8.5 17a9.1 9.1 0 0 1-4.6-1.3l-.3-.2-3.8.6.6-3.7-.2-.3A9.1 9.1 0 1 1 12 20.5zm5-6.8c-.3-.1-1.6-.8-1.8-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.6.1a7.4 7.4 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.5.2-.3a.5.5 0 0 0 0-.5c0-.1-.6-1.4-.8-1.9s-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 12 12 0 0 0 4.5 4 15 15 0 0 0 1.5.5 3.6 3.6 0 0 0 1.7.1 2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .2-1.2c-.1-.1-.3-.2-.6-.3z" />
      </svg>
    </a>
  );
}
