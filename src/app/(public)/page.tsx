import Image from "next/image";

import { CtaButton } from "@/components/cta-button";
import { Prose } from "@/components/prose";
import { RotatingWords } from "@/components/rotating-words";
import { ScrollWheel } from "@/components/scroll-wheel";
import { ServiceGrid } from "@/components/service-grid";
import { getSiteContent } from "@/content/site";

export default async function HomePage() {
  const site = await getSiteContent();
  const { hero, install, system, why } = site.home;

  return (
    <>
      <section className="grid min-h-[91vh] items-center gap-8 px-5 py-10 md:grid-cols-2 md:py-0 md:pr-0 md:pl-[8%]">
        <div>
          <h1 className="font-display text-[36px] leading-none uppercase md:text-[64px] lg:text-[82px]">
            <span className="block text-white">{hero.prefix}</span>
            <RotatingWords words={hero.rotating} />
          </h1>
          <p className="mt-6 max-w-xl pr-0 font-light text-base leading-snug text-accent md:pr-16 md:text-xl md:leading-7">
            {hero.subtitle}
          </p>
          <Prose paragraphs={hero.paragraphs} className="mt-6 max-w-xl text-sm md:text-base" />
        </div>
        <div className="relative min-h-[320px] md:min-h-[70vh]">
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

      <section className="px-5 py-20 md:px-[8%] md:py-28">
        <div className="max-w-[578px]">
          <h2 className="font-display text-[26px] leading-none uppercase md:text-[34px]">{install.title}</h2>
          <Prose paragraphs={install.paragraphs} className="mt-6 text-sm md:text-base" />
          <div className="mt-6">
            <CtaButton href={install.ctaHref}>{install.ctaLabel}</CtaButton>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-[8%] md:py-24">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <ScrollWheel src={system.image} />
          <div className="md:px-[5%]">
            <h2 className="font-display text-[26px] leading-none whitespace-pre-line md:text-[34px]">
              {system.title}
            </h2>
            <div className="mt-6">
              <CtaButton href={system.ctaHref}>{system.ctaLabel}</CtaButton>
            </div>
          </div>
        </div>
        <div className="mt-16">
          <ServiceGrid items={site.services.items} />
        </div>
      </section>

      <section className="px-5 py-20 md:px-[8%] md:py-28">
        <div className="max-w-3xl">
          <h2 className="font-display text-[26px] leading-none uppercase md:text-[34px]">{why.title}</h2>
          <Prose paragraphs={why.paragraphs} className="mt-6 text-sm md:text-base" />
        </div>
      </section>
    </>
  );
}
