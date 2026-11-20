import type { Metadata } from "next";

import { CtaBand } from "@/components/cta-button";
import { Prose } from "@/components/prose";
import { getSiteContent } from "@/content/site";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteContent();
  return {
    title: { absolute: site.seo.aboutTitle },
    description: site.seo.aboutDescription,
  };
}

export const instant = false;

export default async function AboutPage() {
  const { about } = await getSiteContent();

  return (
    <>
      <section className="py-16 md:py-24">
        <h1 className="page-title page-title-mark max-w-5xl">{about.title}</h1>
        <Prose paragraphs={about.paragraphs} className="measure mt-10 md:mt-12" />
      </section>

      <section className="page-section">
        <h2 className="page-heading max-w-3xl">{about.storyTitle}</h2>
        <Prose paragraphs={about.storyParagraphs} className="mt-8 max-w-3xl" />
      </section>

      <section className="page-section">
        <h2 className="page-heading">{about.principlesTitle}</h2>
        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-x-16 md:gap-y-12">
          {about.principles.map((item, index) => (
            <article key={item.title} className="border-t border-line pt-6">
              <p className="page-kicker">{String(index + 1).padStart(2, "0")}</p>
              <h3 className="text-lg font-normal text-foreground">{item.title}</h3>
              <p className="mt-3 max-w-md text-base leading-7 text-muted">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section">
        <h2 className="page-heading">{about.teamTitle}</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {about.team.map((item) => (
            <article key={item.title} className="border border-line px-6 py-8">
              <h3 className="text-lg font-normal leading-snug text-foreground">{item.title}</h3>
              <p className="mt-4 text-base leading-7 text-muted">{item.text}</p>
            </article>
          ))}
        </div>
        <p className="mt-8 text-base leading-7 text-muted">{about.teamNote}</p>
      </section>

      <CtaBand title={about.closeTitle} text={about.closeText} href={about.closeHref} label={about.closeLabel} />
    </>
  );
}
