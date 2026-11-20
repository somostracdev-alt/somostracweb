import type { Metadata } from "next";

import { CtaButton } from "@/components/cta-button";
import { ContactForm } from "@/components/contact-form";
import { getSiteContent } from "@/content/site";
import { uiCopy } from "@/lib/locale";
import { getLocale } from "@/lib/locale-server";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteContent();
  return {
    title: { absolute: site.seo.contactTitle },
    description: site.seo.contactDescription,
  };
}

export default async function ContactPage() {
  const site = await getSiteContent();
  const locale = await getLocale();
  const copy = uiCopy[locale];
  const page = site.contactPage;

  return (
    <section className="py-16 md:pb-28 md:pt-24">
      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        <div>
          <p className="page-kicker">{copy.contactKicker}</p>
          <h1 className="page-title">{page.title}</h1>
          <p className="mt-8 max-w-md text-base leading-7 text-muted md:mt-10 md:text-[1.05rem] md:leading-8">
            {page.intro}
          </p>
          <h2 className="mt-12 font-sans text-lg font-normal text-foreground">{page.stepsTitle}</h2>
          <ol className="mt-5 space-y-4">
            {page.steps.map((step, index) => (
              <li key={step} className="flex gap-4 text-base leading-7 text-muted">
                <span className="page-kicker mb-0 shrink-0">{String(index + 1).padStart(2, "0")}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <ul className="mt-10 space-y-3 text-base">
            <li>
              <a href={`mailto:${site.contact.email}`} className="transition-colors hover:text-accent">
                {site.contact.email}
              </a>
            </li>
            <li>
              <a
                href={site.contact.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-accent"
              >
                {site.contact.phoneDisplay}
              </a>
            </li>
          </ul>
          <div className="mt-8">
            <CtaButton href={site.contact.whatsappHref} variant="solid">
              {page.whatsappButton}
            </CtaButton>
          </div>
        </div>
        <ContactForm site={site} locale={locale} />
      </div>
    </section>
  );
}
