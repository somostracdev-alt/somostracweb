import Image from "next/image";

import type { ServiceItem } from "@/content/site";

export function ServiceGrid({ items }: { items: ServiceItem[] }) {
  return (
    <div className="grid gap-x-12 gap-y-10 md:grid-cols-2">
      {items.map((item) => (
        <article key={item.id} className="group">
          <Image
            src={item.icon}
            alt=""
            width={96}
            height={96}
            className="mb-4 h-16 w-16 object-contain"
          />
          <h3 className="mb-2.5 font-sans text-lg font-normal capitalize leading-6 text-white transition-colors group-hover:text-accent">
            {item.title}
          </h3>
          <div className="space-y-2 text-sm font-extralight leading-[22px] text-white">
            {item.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
