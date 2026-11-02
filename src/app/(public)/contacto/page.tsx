import type { Metadata } from "next";

import { ContactForm } from "@/components/contact-form";
import { getSiteContent } from "@/content/site";
import { getLocale } from "@/lib/locale-server";

export const instant = false;

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteContent();
  return { title: site.contactPage.title };
}

export default async function ContactPage() {
  const site = await getSiteContent();
  const locale = await getLocale();

  return (
    <section className="py-16 md:pb-28 md:pt-24">
      <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-24">
        <div>
          <h1 className="page-title">{site.contactPage.title}</h1>
          <ul className="mt-10 space-y-4 text-base font-light md:mt-14">
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
