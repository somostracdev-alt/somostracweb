import type { Metadata } from "next";
import Image from "next/image";

import { CtaBand, CtaButton } from "@/components/cta-button";
import { RotatingWords } from "@/components/rotating-words";
import { ScrollWheel } from "@/components/scroll-wheel";
import { ServiceGrid } from "@/components/service-grid";
import { getSiteContent } from "@/content/site";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteContent();
  return {
    title: { absolute: site.seo.homeTitle },
    description: site.seo.homeDescription,
  };
}

export default async function HomePage() {
  const site = await getSiteContent();
  const { hero, install, system, sectors, why, close } = site.home;

  return (
    <>
      <section className="grid items-center gap-10 py-14 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:gap-16 md:py-20">
        <div>
          <h1 className="font-display text-[2.75rem] leading-[0.92] tracking-[0.01em] uppercase md:text-6xl lg:text-[4.6rem]">
            <span className="block text-foreground">{hero.prefix}</span>
            <RotatingWords words={hero.rotating} />
          </h1>
          <p className="mt-7 max-w-lg text-[1.05rem] font-normal leading-7 tracking-normal text-accent md:mt-8 md:text-xl md:leading-8">
            {hero.subtitle}
          </p>
          <div className="mt-6 max-w-xl space-y-4 text-base leading-7 text-muted">
            {hero.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-9 flex flex-wrap gap-3">
            <CtaButton href={hero.primaryHref} variant="solid">
              {hero.primaryLabel}
            </CtaButton>
            <CtaButton href={site.contact.whatsappHref}>{hero.secondaryLabel}</CtaButton>
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

      <section className="full-bleed band-light">
        <div className="mx-auto grid w-full max-w-[1180px] items-start gap-10 px-6 py-16 sm:px-10 md:grid-cols-2 md:gap-16 md:py-24 lg:px-12">
          <h2 className="page-heading max-w-md">{install.title}</h2>
          <div>
            <div className="space-y-5 text-base leading-7 text-[#161616]/75">
              {install.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3">
              {install.stages.map((stage) => (
                <li key={stage} className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                  {stage}
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <CtaButton href={install.ctaHref} variant="solid">
                {install.ctaLabel}
              </CtaButton>
            </div>
          </div>
        </div>
      </section>

      <section className="full-bleed band-light border-t border-black/10">
        <div className="mx-auto w-full max-w-[1180px] px-6 py-16 sm:px-10 md:py-24 lg:px-12">
          <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)] md:gap-16">
            <div>
              <h2 className="page-heading max-w-xl whitespace-pre-line">{system.title}</h2>
              <div className="mt-8">
                <CtaButton href={system.ctaHref} variant="solid">
                  {system.ctaLabel}
                </CtaButton>
              </div>
            </div>
            <ScrollWheel src={system.image} className="mx-auto w-full max-w-sm" />
          </div>
          <div className="mt-14 md:mt-16">
            <ServiceGrid items={site.services.items} />
          </div>
        </div>
      </section>

      <section className="page-section">
        <h2 className="page-heading max-w-3xl">{sectors.title}</h2>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sectors.items.map((item) => (
            <li key={item} className="border border-line px-5 py-8 text-base leading-7">
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-10 max-w-2xl text-base leading-7 text-muted">{sectors.close}</p>
      </section>

      <section className="full-bleed band-light">
        <div className="mx-auto grid w-full max-w-[1180px] items-start gap-12 px-6 py-16 sm:px-10 md:grid-cols-[minmax(0,1.15fr)_minmax(16rem,22rem)] md:gap-16 md:py-24 lg:px-12">
          <div>
            <h2 className="page-heading">{why.title}</h2>
            <div className="mt-10 space-y-6">
              {why.paragraphs.map((paragraph) => (
                <p key={paragraph} className="border-t border-black/10 pt-5 text-base leading-7 text-[#161616]/80">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="mt-10">
              <CtaButton href={why.ctaHref} variant="solid">
                {why.ctaLabel}
              </CtaButton>
            </div>
          </div>
          <aside className="bg-black px-8 py-10 text-white">
            <p className="font-display text-7xl leading-none tracking-[0.02em] text-accent">{why.statValue}</p>
            <p className="mt-6 text-base leading-7">{why.statText}</p>
            <p className="mt-6 text-xs uppercase tracking-[0.14em] text-white/60">{why.statSource}</p>
          </aside>
        </div>
      </section>

      <CtaBand title={close.title} text={close.text} href={close.ctaHref} label={close.ctaLabel} />
    </>
  );
}
