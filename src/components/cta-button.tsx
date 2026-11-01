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
      className="inline-flex border border-accent bg-black px-[15px] py-2 font-sans text-base font-semibold uppercase tracking-[1px] text-white transition-colors hover:border-white hover:bg-white hover:text-black"
    >
      {children}
    </Link>
  );
}
