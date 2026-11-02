import type { Metadata } from "next";

import { ContactForm } from "@/components/contact-form";
import { getSiteContent } from "@/content/site";

export const metadata: Metadata = {
  title: "Contacto",
};

export default async function ContactPage() {
  const site = await getSiteContent();

  return (
    <section className="px-5 py-16 md:px-[8%] md:py-24">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-[34px] leading-none">{site.contactPage.title}</h1>
          <ul className="mt-8 space-y-3 font-extralight">
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
        <ContactForm site={site} />
      </div>
    </section>
  );
}
