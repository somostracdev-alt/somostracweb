import Link from "next/link";

export function CtaButton({
  href,
  children,
  variant = "outline",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "outline" | "solid";
}) {
  const look =
    variant === "solid"
      ? "border border-accent bg-accent text-black hover:border-foreground hover:bg-foreground hover:text-background"
      : "border border-accent bg-transparent text-foreground hover:border-foreground hover:bg-foreground hover:text-background";

  return (
    <Link
      href={href}
      className={`inline-flex px-5 py-2.5 font-sans text-sm font-semibold uppercase tracking-[0.14em] transition-colors ${look}`}
    >
      {children}
    </Link>
  );
}

export function CtaBand({
  kicker,
  title,
  href,
  label,
}: {
  kicker: string;
  title: string;
  href: string;
  label: string;
}) {
  return (
    <section className="page-section">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-16">
        <div className="max-w-xl">
          <p className="page-kicker">{kicker}</p>
          <h2 className="page-heading">{title}</h2>
        </div>
        <CtaButton href={href} variant="solid">
          {label}
        </CtaButton>
      </div>
    </section>
  );
}
