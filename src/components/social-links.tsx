import type { SocialLink } from "@/content/site";

function Icon({ id }: { id: SocialLink["id"] }) {
  if (id === "instagram") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
        <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm10 1.8H7A2.2 2.2 0 0 0 4.8 7v10A2.2 2.2 0 0 0 7 19.2h10a2.2 2.2 0 0 0 2.2-2.2V7A2.2 2.2 0 0 0 17 4.8zM12 8.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2zm0 1.6A2.2 2.2 0 1 0 14.2 12 2.2 2.2 0 0 0 12 9.8zM17.35 6.4a.9.9 0 1 1-.9.9.9.9 0 0 1 .9-.9z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M6.5 9H4V20h2.5zM5.25 4A1.5 1.5 0 1 0 5.26 7a1.5 1.5 0 0 0 0-3zM20 20h-2.5v-5.6c0-1.55-.56-2.6-1.96-2.6a2.12 2.12 0 0 0-1.98 1.42 2.7 2.7 0 0 0-.13.93V20H11v-7.2c0-2.55-.08-4.7-2.2-4.7H8.5V20H11V9h2.4v1.5a3.2 3.2 0 0 1 2.9-1.6c2.12 0 3.7 1.38 3.7 4.35z" />
    </svg>
  );
}

export function SocialLinks({ links }: { links: SocialLink[] }) {
  if (links.length === 0) return null;

  return (
    <div className="flex items-center gap-4">
      {links.map((link) => {
        const className = "text-white transition-colors hover:text-accent";
        if (!link.href.trim()) {
          return (
            <span key={link.id} aria-label={link.label} className={className}>
              <Icon id={link.id} />
            </span>
          );
        }
        return (
          <a
            key={link.id}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            aria-label={link.label}
            className={className}
          >
            <Icon id={link.id} />
          </a>
        );
      })}
    </div>
  );
}
