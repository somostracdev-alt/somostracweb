import { LanguageSwitch } from "@/components/language-switch";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteContent } from "@/content/site";
import { uiCopy } from "@/lib/locale";
import { getLocale } from "@/lib/locale-server";

export const instant = false;

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const site = await getSiteContent();
  const copy = uiCopy[locale];

  return (
    <div className="mx-auto w-full max-w-[1180px] px-6 sm:px-10 lg:px-12">
      <SiteHeader
        site={site}
        themeLightLabel={copy.themeLight}
        themeDarkLabel={copy.themeDark}
        menuOpenLabel={copy.menuOpen}
        menuCloseLabel={copy.menuClose}
      />
      <main>{children}</main>
      <SiteFooter
        site={site}
        loginLabel={copy.login}
        languageSwitch={<LanguageSwitch locale={locale} />}
        whatsapp={{
          greeting: copy.waGreeting,
          bubble: copy.waBubble,
          open: copy.waOpen,
          close: copy.waClose,
          label: copy.waLabel,
          role: copy.waRole,
          messageLabel: copy.waMessageLabel,
        }}
      />
    </div>
  );
}
