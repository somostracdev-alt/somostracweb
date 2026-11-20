import Image from "next/image";
import Link from "next/link";

import type { ServiceItem } from "@/content/site";

function indexLabel(index: number) {
  return String(index + 1).padStart(2, "0");
}

export function ServiceGrid({ items }: { items: ServiceItem[] }) {
  return (
    <div className="grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
      {items.map((item, index) => (
        <article key={item.id} className="border-t border-line pt-7">
          <p className="page-kicker">{indexLabel(index)}</p>
          <h3 className="mb-4 font-sans text-base font-normal text-foreground">
            <Link href={`/servicios#${item.id}`} className="transition-colors hover:text-accent">
              {item.title}
            </Link>
          </h3>
          <p className="text-sm leading-7 text-muted">{item.summary}</p>
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
            <h2 className="mb-4 font-sans text-xl font-normal text-foreground md:text-2xl">{item.title}</h2>
            <p className="max-w-md text-base leading-7 text-foreground">{item.lead}</p>
            <ul className="mt-5 max-w-md list-disc space-y-2 pl-5 text-sm leading-7 text-muted md:text-base">
              {item.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <p className="mt-5 max-w-md text-base leading-7 text-foreground">{item.closing}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
