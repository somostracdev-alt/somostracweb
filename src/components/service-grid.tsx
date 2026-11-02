import Image from "next/image";

import type { ServiceItem } from "@/content/site";

export function ServiceGrid({ items }: { items: ServiceItem[] }) {
  return (
    <div className="grid gap-x-16 gap-y-14 md:grid-cols-2">
      {items.map((item) => (
        <article key={item.id} className="group border-t border-line pt-7">
          <Image
            src={item.icon}
            alt=""
            width={96}
            height={96}
            className="mb-6 h-12 w-12 object-contain"
          />
          <h3 className="mb-4 font-sans text-base font-normal tracking-wide text-foreground transition-colors group-hover:text-accent md:text-lg">
            {item.title}
          </h3>
          <div className="max-w-md space-y-3 text-sm font-light leading-7 text-muted">
            {item.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

export function ServiceBlocks({ items }: { items: ServiceItem[] }) {
  return (
    <div className="space-y-16 md:space-y-24">
      {items.map((item, index) => (
        <article
          key={item.id}
          className="grid items-center gap-8 border-t border-line pt-10 md:grid-cols-2 md:gap-16 md:pt-14"
        >
          <div
            className={`relative aspect-[16/9] overflow-hidden border border-line bg-surface ${index % 2 === 1 ? "md:order-2" : ""}`}
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
            <Image
              src={item.icon}
              alt=""
              width={96}
              height={96}
              className="mb-6 h-12 w-12 object-contain"
            />
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
