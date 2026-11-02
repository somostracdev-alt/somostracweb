import type { Metadata } from "next";

import { CtaBand } from "@/components/cta-button";
import { Prose } from "@/components/prose";
import { ServiceBlocks } from "@/components/service-grid";
import { getSiteContent } from "@/content/site";
import { uiCopy } from "@/lib/locale";
import { getLocale } from "@/lib/locale-server";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteContent();
  return { title: site.services.title.replace(/\.$/, "") };
}

export const instant = false;

export default async function ServicesPage() {
  const site = await getSiteContent();
  const copy = uiCopy[await getLocale()];
  const { services, home } = site;

  return (
    <>
      <section className="py-16 md:pb-8 md:pt-24">
        <p className="page-kicker">{copy.processKicker}</p>
        <h1 className="page-title max-w-5xl">{services.title}</h1>
        <Prose paragraphs={services.paragraphs} className="measure mt-10 md:mt-12" />
        <div className="mt-16 md:mt-20">
          <ServiceBlocks items={services.items} />
        </div>
      </section>
      <CtaBand
        kicker={copy.closeKicker}
        title={home.install.title}
        href={home.install.ctaHref}
        label={home.install.ctaLabel}
      />
    </>
  );
}
