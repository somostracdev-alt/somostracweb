import type { Metadata } from "next";

import { CtaBand } from "@/components/cta-button";
import { Prose } from "@/components/prose";
import { getSiteContent } from "@/content/site";
import { uiCopy } from "@/lib/locale";
import { getLocale } from "@/lib/locale-server";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteContent();
  return { title: site.about.title.replace(/\.$/, "") };
}

export const instant = false;

export default async function AboutPage() {
  const site = await getSiteContent();
  const copy = uiCopy[await getLocale()];
  const { about, footer, home } = site;

  return (
    <>
      <section className="py-16 md:py-24">
        <p className="page-kicker">{footer.tagline}</p>
        <h1 className="page-title max-w-5xl">{about.title}</h1>
        <div className="mt-14 grid items-start gap-14 md:mt-16 md:grid-cols-2 md:gap-20">
          <Prose paragraphs={about.paragraphs} />
          <div>
            <h2 className="mb-8 font-sans text-xl font-normal tracking-wide text-foreground md:text-2xl md:leading-snug">
              {about.storyTitle}
            </h2>
            <Prose paragraphs={about.storyParagraphs} />
          </div>
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
