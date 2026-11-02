import { setLocaleAction } from "@/app/locale-actions";
import { uiCopy, type Locale } from "@/lib/locale";

export function LanguageSwitch({ locale }: { locale: Locale }) {
  const copy = uiCopy[locale];

  return (
    <div>
      <div className="flex items-center gap-2 font-sans text-sm font-semibold uppercase tracking-[1px]">
        <form action={setLocaleAction}>
          <input type="hidden" name="locale" value="es" />
          <button
            type="submit"
            aria-current={locale === "es" ? "true" : undefined}
            className={locale === "es" ? "text-accent" : "text-muted transition-colors hover:text-accent"}
          >
            ES
          </button>
        </form>
        <span className="text-muted" aria-hidden>
          /
        </span>
        <form action={setLocaleAction}>
          <input type="hidden" name="locale" value="en" />
          <button
            type="submit"
            aria-current={locale === "en" ? "true" : undefined}
            className={locale === "en" ? "text-accent" : "text-muted transition-colors hover:text-accent"}
          >
            EN
          </button>
        </form>
      </div>
      <a
        href="https://sib.dev"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block text-xs font-light text-muted transition-colors hover:text-accent"
      >
        {copy.developedBy} sib.dev
      </a>
    </div>
  );
}
