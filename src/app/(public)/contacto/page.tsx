import type { Metadata } from "next";

import { ContactForm } from "@/components/contact-form";
import { getSiteContent } from "@/content/site";
import { uiCopy } from "@/lib/locale";
import { getLocale } from "@/lib/locale-server";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteContent();
  return { title: site.contactPage.title };
}

export default async function ContactPage() {
  const site = await getSiteContent();
  const locale = await getLocale();
  const copy = uiCopy[locale];

  return (
    <section className="py-16 md:pb-28 md:pt-24">
      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        <div>
          <p className="page-kicker">{copy.contactKicker}</p>
          <h1 className="page-title">{site.contactPage.title}</h1>
          <p className="mt-8 max-w-md text-base font-light leading-7 text-muted md:mt-10 md:text-[1.05rem] md:leading-8">
            {copy.contactLead}
          </p>
          <ul className="mt-10 space-y-3 text-base font-light">
            <li>
              <a href={`mailto:${site.contact.email}`} className="transition-colors hover:text-accent">
                {site.contact.email}
              </a>
            </li>
            <li>
              <a href={site.contact.whatsappHref} className="transition-colors hover:text-accent">
                {site.contact.phoneDisplay}
              </a>
            </li>
          </ul>
        </div>
        <ContactForm site={site} locale={locale} />
      </div>
    </section>
  );
}
