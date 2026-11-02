"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { SiteContent } from "@/content/site";
import { SocialLinks } from "@/components/social-links";
import { WhatsAppButton } from "@/components/whatsapp-button";

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

export function SiteFooter({
  site,
  languageSwitch,
  loginLabel,
  whatsapp,
}: {
  site: SiteContent;
  languageSwitch: React.ReactNode;
  loginLabel: string;
  whatsapp: {
    greeting: string;
    bubble: string;
    open: string;
    close: string;
    label: string;
    role: string;
    messageLabel: string;
  };
}) {
  const compact = useCompactFooter("site-footer");
  const about = site.navigation.find((link) => link.id === "quienes") ?? {
    id: "quienes",
    label: "Quiénes somos",
    href: "/quienes-somos",
  };

  return (
    <>
      <footer id="site-footer" className="border-t border-line bg-background">
        <div className="grid gap-12 py-16 md:grid-cols-3 md:gap-16 md:py-20">
          <p className="max-w-xs font-display text-2xl uppercase leading-tight tracking-[0.04em] md:text-[1.75rem]">
            {site.footer.tagline}
          </p>
          <div>
            <p className="page-kicker">{site.footer.linksTitle}</p>
            <ul className="space-y-3">
              {site.footer.links.map((link) => (
                <li key={link.id}>
                  <Link href={link.href} className="font-light transition-colors hover:text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/login" className="font-light transition-colors hover:text-accent">
                  {loginLabel}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="page-kicker">{site.footer.contactTitle}</p>
            <ul className="space-y-3 font-light">
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
            <div className="mt-8">
              <SocialLinks links={site.social} />
            </div>
            <div className="mt-10">{languageSwitch}</div>
          </div>
        </div>
        <p className="border-t border-line py-6 text-center text-sm font-light text-muted">
          {site.footer.copyright}
        </p>
      </footer>

      <div
        inert={!compact}
        aria-hidden={!compact}
        className={`fixed inset-x-0 bottom-0 z-30 border-t border-line bg-background/80 backdrop-blur-md transition-transform duration-300 motion-reduce:transition-none ${
          compact ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-4 px-6 py-3 sm:px-10 lg:px-12">
          <Link href="/" aria-label={site.brand.name} className="shrink-0">
            <Image
              src={site.brand.logo}
              alt=""
              width={482}
              height={128}
              className="brand-logo h-7 w-auto"
            />
          </Link>
          <Link
            href={about.href}
            className="truncate font-sans text-xs font-normal uppercase tracking-[1px] text-foreground transition-colors hover:text-accent sm:text-sm"
          >
            {about.label}
          </Link>
          <SocialLinks links={site.social} />
        </div>
      </div>

      <WhatsAppButton href={site.contact.whatsappHref} lifted={compact} copy={whatsapp} />
    </>
  );
}
