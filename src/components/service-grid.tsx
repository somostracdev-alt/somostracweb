import Image from "next/image";
import Link from "next/link";

import type { ServiceItem } from "@/content/site";

function indexLabel(index: number) {
  return String(index + 1).padStart(2, "0");
}

export function ServiceGrid({ items }: { items: ServiceItem[] }) {
  return (
    <div className="grid gap-x-12 gap-y-12 md:grid-cols-2 lg:gap-x-16">
      {items.map((item, index) => (
        <article key={item.id} className="border-t border-line pt-7">
          <p className="page-kicker">{indexLabel(index)}</p>
          <h3 className="mb-4 font-sans text-base font-normal tracking-wide text-foreground md:text-lg">
            <Link href={`/servicios#${item.id}`} className="transition-colors hover:text-accent">
              {item.title}
            </Link>
          </h3>
          <p className="max-w-md text-sm font-light leading-7 text-muted">{item.paragraphs[0]}</p>
        </article>
      ))}
    </div>
  );
}

export function ServiceBlocks({ items }: { items: ServiceItem[] }) {
  return (
    <div className="space-y-16 md:space-y-20">
      {items.map((item, index) => (
        <article
          id={item.id}
          key={item.id}
          className="grid scroll-mt-28 items-center gap-8 border-t border-line pt-10 md:grid-cols-2 md:gap-16 md:pt-12"
        >
          <div
            className={`relative aspect-[16/9] overflow-hidden bg-surface ${index % 2 === 1 ? "md:order-2" : ""}`}
          >
            {item.image ? (
              <Image
                src={item.image}
                alt=""
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-cover object-center"
              />
            ) : null}
          </div>
          <div>
            <p className="page-kicker">{indexLabel(index)}</p>
            <h2 className="mb-5 font-sans text-xl font-normal tracking-wide text-foreground md:text-2xl">
              {item.title}
            </h2>
            <div className="max-w-md space-y-4 text-sm font-light leading-7 text-muted md:text-base md:leading-8">
              {item.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
