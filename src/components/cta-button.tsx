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
      ? "border border-accent bg-accent text-black hover:border-[#161616] hover:bg-[#161616] hover:text-white"
      : "border border-accent bg-transparent text-current hover:border-[#161616] hover:bg-[#161616] hover:text-white";
  const className = `inline-flex px-5 py-2.5 font-sans text-sm font-semibold uppercase tracking-[0.14em] transition-colors ${look}`;

  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function CtaBand({
  kicker,
  title,
  text,
  href,
  label,
}: {
  kicker?: string;
  title: string;
  text?: string;
  href: string;
  label: string;
}) {
  return (
    <section className="page-section">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-16">
        <div className="max-w-xl">
          {kicker ? <p className="page-kicker">{kicker}</p> : null}
          <h2 className="page-heading">{title}</h2>
          {text ? <p className="mt-6 max-w-md text-base leading-7 text-muted">{text}</p> : null}
        </div>
        <CtaButton href={href} variant="solid">
          {label}
        </CtaButton>
      </div>
    </section>
  );
}
