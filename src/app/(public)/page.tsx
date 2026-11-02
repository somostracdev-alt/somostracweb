import Image from "next/image";

import { CtaButton } from "@/components/cta-button";
import { Prose } from "@/components/prose";
import { RotatingWords } from "@/components/rotating-words";
import { ScrollWheel } from "@/components/scroll-wheel";
import { ServiceGrid } from "@/components/service-grid";
import { getSiteContent } from "@/content/site";

export const instant = false;

export default async function HomePage() {
  const site = await getSiteContent();
  const { hero, install, system, why } = site.home;

  return (
    <>
      <section className="grid items-center gap-12 py-16 md:min-h-[calc(100vh-6rem)] md:grid-cols-2 md:gap-16 md:py-20">
        <div className="max-w-xl">
          <h1 className="font-display text-[2.75rem] leading-[0.98] tracking-[0.02em] uppercase md:text-6xl lg:text-[4.75rem]">
            <span className="block text-foreground">{hero.prefix}</span>
            <RotatingWords words={hero.rotating} />
          </h1>
          <p className="mt-8 max-w-md text-[1.05rem] font-light leading-7 text-accent md:mt-10 md:text-xl md:leading-8">
            {hero.subtitle}
          </p>
          <Prose paragraphs={hero.paragraphs} className="mt-8 md:mt-10" />
        </div>
        <div className="relative min-h-[280px] md:min-h-[62vh]">
          <Image
            src={hero.image}
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-contain object-center md:object-right"
          />
        </div>
      </section>

      <section className="page-section">
        <div className="measure">
          <h2 className="page-heading">{install.title}</h2>
          <Prose paragraphs={install.paragraphs} className="mt-8" />
          <div className="mt-10">
            <CtaButton href={install.ctaHref}>{install.ctaLabel}</CtaButton>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
          <ScrollWheel src={system.image} />
          <div>
            <h2 className="page-heading whitespace-pre-line">{system.title}</h2>
            <div className="mt-10">
              <CtaButton href={system.ctaHref}>{system.ctaLabel}</CtaButton>
            </div>
          </div>
        </div>
        <div className="mt-20 md:mt-28">
          <ServiceGrid items={site.services.items} />
        </div>
      </section>

      <section className="page-section">
        <div className="measure">
          <h2 className="page-heading">{why.title}</h2>
          <div className="mt-10 space-y-8">
            {why.paragraphs.map((paragraph) => (
              <p key={paragraph} className="font-light leading-7 text-muted md:text-[1.05rem] md:leading-8">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
