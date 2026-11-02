import type { Metadata } from "next";

import { Prose } from "@/components/prose";
import { ServiceBlocks } from "@/components/service-grid";
import { getSiteContent } from "@/content/site";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteContent();
  return { title: site.services.title.replace(/\.$/, "") };
}

export const instant = false;

export default async function ServicesPage() {
  const { services } = await getSiteContent();

  return (
    <section className="py-16 md:pb-28 md:pt-24">
      <h1 className="page-title max-w-5xl">{services.title}</h1>
      <Prose paragraphs={services.paragraphs} className="measure mt-10 md:mt-14" />
      <div className="mt-16 md:mt-24">
        <ServiceBlocks items={services.items} />
      </div>
    </section>
  );
}
