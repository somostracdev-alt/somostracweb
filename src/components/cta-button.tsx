import Link from "next/link";

export function CtaButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex border border-accent px-5 py-2.5 font-sans text-sm font-semibold uppercase tracking-[0.14em] text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
    >
      {children}
    </Link>
  );
}
