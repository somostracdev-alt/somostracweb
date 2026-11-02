import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteContent } from "@/content/site";

export const instant = false;

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const site = await getSiteContent();

  return (
    <>
      <SiteHeader site={site} />
      <main>{children}</main>
      <SiteFooter site={site} />
    </>
  );
}
