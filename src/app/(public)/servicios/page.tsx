import type { Metadata } from "next";

import { Prose } from "@/components/prose";
import { ServiceGrid } from "@/components/service-grid";
import { getSiteContent } from "@/content/site";

export const metadata: Metadata = {
  title: "Servicios",
};

export const instant = false;

export default async function ServicesPage() {
  const { services } = await getSiteContent();

  return (
    <section className="py-16 md:py-24">
      <h1 className="font-display text-[30px] leading-none uppercase md:text-7xl lg:text-[100px]">{services.title}</h1>
      <Prose paragraphs={services.paragraphs} className="mt-8 max-w-3xl text-sm md:text-base" />
      <div className="mt-14">
        <ServiceGrid items={services.items} />
      </div>
    </section>
  );
}
