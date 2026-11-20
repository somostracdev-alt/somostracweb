import type { Metadata } from "next";

import { CtaBand } from "@/components/cta-button";
import { Prose } from "@/components/prose";
import { ServiceBlocks } from "@/components/service-grid";
import { getSiteContent } from "@/content/site";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteContent();
  return {
    title: { absolute: site.seo.servicesTitle },
    description: site.seo.servicesDescription,
  };
}

export const instant = false;

export default async function ServicesPage() {
  const { services } = await getSiteContent();

  return (
    <>
      <section className="py-16 md:pb-8 md:pt-24">
        <h1 className="page-title max-w-5xl">{services.title}</h1>
        <Prose paragraphs={services.paragraphs} className="measure mt-10 md:mt-12" />
        <div className="mt-16 md:mt-20">
          <ServiceBlocks items={services.items} />
        </div>
      </section>
      <CtaBand
        title={services.closeTitle}
        text={services.closeText}
        href={services.closeHref}
        label={services.closeLabel}
      />
    </>
  );
}
