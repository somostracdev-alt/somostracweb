import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteContent } from "@/content/site";

export const instant = false;

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const site = await getSiteContent();

  return (
    <div className="mx-auto w-full max-w-[1200px] px-6 sm:px-10 lg:px-16">
      <SiteHeader site={site} />
      <main>{children}</main>
      <SiteFooter site={site} />
    </div>
  );
}
