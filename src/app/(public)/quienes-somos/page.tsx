import type { Metadata } from "next";

import { Prose } from "@/components/prose";
import { getSiteContent } from "@/content/site";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteContent();
  return { title: site.about.title.replace(/\.$/, "") };
}

export const instant = false;

export default async function AboutPage() {
  const { about } = await getSiteContent();

  return (
    <>
      <section className="py-16 md:py-24">
        <h1 className="page-title max-w-5xl">{about.title}</h1>
        <Prose paragraphs={about.paragraphs} className="measure mt-10 md:mt-14" />
      </section>
      <section className="page-section">
        <h2 className="max-w-2xl font-sans text-xl font-normal tracking-wide text-foreground md:text-2xl md:leading-snug">
          {about.storyTitle}
        </h2>
        <Prose paragraphs={about.storyParagraphs} className="measure mt-8 md:mt-10" />
      </section>
    </>
  );
}
