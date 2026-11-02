import Image from "next/image";

import { CtaBand, CtaButton } from "@/components/cta-button";
import { Prose } from "@/components/prose";
import { RotatingWords } from "@/components/rotating-words";
import { ScrollWheel } from "@/components/scroll-wheel";
import { ServiceGrid } from "@/components/service-grid";
import { getSiteContent } from "@/content/site";
import { uiCopy } from "@/lib/locale";
import { getLocale } from "@/lib/locale-server";

export const instant = false;

export default async function HomePage() {
  const site = await getSiteContent();
  const copy = uiCopy[await getLocale()];
  const { hero, install, system, why } = site.home;

  return (
    <>
      <section className="grid items-end gap-10 py-14 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:gap-16 md:py-20">
        <div>
          <p className="page-kicker">{site.footer.tagline}</p>
          <h1 className="font-display text-[2.75rem] leading-[0.98] tracking-[0.02em] uppercase md:text-6xl lg:text-[4.6rem]">
            <span className="block text-foreground">{hero.prefix}</span>
            <RotatingWords words={hero.rotating} />
          </h1>
          <p className="mt-7 max-w-lg text-[1.05rem] font-light leading-7 text-accent md:mt-8 md:text-xl md:leading-8">
            {hero.subtitle}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <CtaButton href={install.ctaHref} variant="solid">
              {install.ctaLabel}
            </CtaButton>
            <CtaButton href={system.ctaHref}>{system.ctaLabel}</CtaButton>
          </div>
        </div>
        <div className="relative aspect-[4/5] w-full max-h-[34rem] md:max-h-none md:aspect-auto md:min-h-[28rem]">
          <Image
            src={hero.image}
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-contain object-center md:object-right"
          />
        </div>
      </section>

      <section className="page-section">
        <div className="grid gap-10 md:grid-cols-3 md:gap-12">
          {hero.paragraphs.map((paragraph, index) => (
            <p key={paragraph} className="border-t border-line pt-6 text-sm font-light leading-7 text-muted md:text-[0.95rem] md:leading-8">
              <span className="page-kicker block">{String(index + 1).padStart(2, "0")}</span>
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className="page-section">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
          <ScrollWheel src={system.image} />
          <div>
            <p className="page-kicker">{copy.processKicker}</p>
            <h2 className="page-heading whitespace-pre-line">{system.title}</h2>
            <Prose paragraphs={install.paragraphs} className="mt-8" />
            <div className="mt-10">
              <CtaButton href={system.ctaHref}>{system.ctaLabel}</CtaButton>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="mb-12 md:mb-16">
          <p className="page-kicker">{copy.offerKicker}</p>
          <h2 className="page-heading">{site.services.title}</h2>
        </div>
        <ServiceGrid items={site.services.items} />
      </section>

      <section className="page-section">
        <p className="page-kicker">{copy.problemKicker}</p>
        <h2 className="page-heading">{why.title}</h2>
        <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-12">
          {why.paragraphs.map((paragraph, index) => (
            <p key={paragraph} className="border-t border-line pt-6 text-sm font-light leading-7 text-muted md:text-[0.95rem] md:leading-8">
              <span className="page-kicker block">{String(index + 1).padStart(2, "0")}</span>
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <CtaBand kicker={copy.closeKicker} title={install.title} href={install.ctaHref} label={install.ctaLabel} />
    </>
  );
}
