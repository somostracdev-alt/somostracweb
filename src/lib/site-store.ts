import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { connection } from "next/server";
import { cache } from "react";

import { englishSiteContent } from "@/content/en";
import {
  defaultSiteContent,
  type ServiceItem,
  type SiteContent,
  type SiteLink,
  type SocialLink,
} from "@/content/site";
import type { Locale } from "@/lib/locale";
import { getLocale } from "@/lib/locale-server";

const contentPath = path.join(process.cwd(), "data", "site-content.json");

function asString(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

function asLines(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) return fallback;
  return value.filter((item): item is string => typeof item === "string");
}

function asLinks(value: unknown, fallback: SiteLink[]) {
  if (!Array.isArray(value)) return fallback;
  return fallback.map((link) => {
    const found = value.find(
      (item) => item && typeof item === "object" && (item as SiteLink).id === link.id,
    ) as Partial<SiteLink> | undefined;
    if (!found) return link;
    return {
      ...link,
      label: asString(found.label, link.label),
      href: asString(found.href, link.href),
    };
  });
}

function asSocial(value: unknown, fallback: SocialLink[]) {
  if (!Array.isArray(value)) return fallback;
  return fallback.map((link) => {
    const found = value.find(
      (item) => item && typeof item === "object" && (item as SocialLink).id === link.id,
    ) as Partial<SocialLink> | undefined;
    if (!found) return link;
    return {
      ...link,
      label: asString(found.label, link.label),
      href: asString(found.href, link.href),
    };
  });
}

function asServices(value: unknown, fallback: ServiceItem[]) {
  if (!Array.isArray(value)) return fallback;
  return fallback.map((item) => {
    const found = value.find(
      (entry) => entry && typeof entry === "object" && (entry as ServiceItem).id === item.id,
    ) as Partial<ServiceItem> | undefined;
    if (!found) return item;
    return {
      ...item,
      title: asString(found.title, item.title),
      icon: asString(found.icon, item.icon),
      image: asString(found.image, item.image),
      paragraphs: asLines(found.paragraphs, item.paragraphs),
    };
  });
}

function mergeSiteContent(saved: unknown): SiteContent {
  const base = structuredClone(defaultSiteContent);
  if (!saved || typeof saved !== "object") return base;
  const data = saved as Partial<SiteContent>;

  base.brand.name = asString(data.brand?.name, base.brand.name);
  base.brand.logo = asString(data.brand?.logo, base.brand.logo);
  base.navigation = asLinks(data.navigation, base.navigation);
  base.social = asSocial(data.social, base.social);

  base.contact.email = asString(data.contact?.email, base.contact.email);
  base.contact.phoneDisplay = asString(data.contact?.phoneDisplay, base.contact.phoneDisplay);
  base.contact.phoneHref = asString(data.contact?.phoneHref, base.contact.phoneHref);
  base.contact.whatsappHref = asString(data.contact?.whatsappHref, base.contact.whatsappHref);

  base.footer.tagline = asString(data.footer?.tagline, base.footer.tagline);
  base.footer.linksTitle = asString(data.footer?.linksTitle, base.footer.linksTitle);
  base.footer.contactTitle = asString(data.footer?.contactTitle, base.footer.contactTitle);
  base.footer.copyright = asString(data.footer?.copyright, base.footer.copyright);
  base.footer.links = asLinks(data.footer?.links, base.footer.links);

  base.home.hero.prefix = asString(data.home?.hero?.prefix, base.home.hero.prefix);
  base.home.hero.rotating = asLines(data.home?.hero?.rotating, base.home.hero.rotating);
  base.home.hero.subtitle = asString(data.home?.hero?.subtitle, base.home.hero.subtitle);
  base.home.hero.paragraphs = asLines(data.home?.hero?.paragraphs, base.home.hero.paragraphs);
  base.home.hero.image = asString(data.home?.hero?.image, base.home.hero.image);

  base.home.install.title = asString(data.home?.install?.title, base.home.install.title);
  base.home.install.paragraphs = asLines(data.home?.install?.paragraphs, base.home.install.paragraphs);
  base.home.install.ctaLabel = asString(data.home?.install?.ctaLabel, base.home.install.ctaLabel);
  base.home.install.ctaHref = asString(data.home?.install?.ctaHref, base.home.install.ctaHref);

  base.home.system.title = asString(data.home?.system?.title, base.home.system.title);
  base.home.system.image = asString(data.home?.system?.image, base.home.system.image);
  base.home.system.ctaLabel = asString(data.home?.system?.ctaLabel, base.home.system.ctaLabel);
  base.home.system.ctaHref = asString(data.home?.system?.ctaHref, base.home.system.ctaHref);

  base.home.why.title = asString(data.home?.why?.title, base.home.why.title);
  base.home.why.paragraphs = asLines(data.home?.why?.paragraphs, base.home.why.paragraphs);

  base.about.title = asString(data.about?.title, base.about.title);
  base.about.paragraphs = asLines(data.about?.paragraphs, base.about.paragraphs);
  base.about.storyTitle = asString(data.about?.storyTitle, base.about.storyTitle);
  base.about.storyParagraphs = asLines(data.about?.storyParagraphs, base.about.storyParagraphs);

  base.services.title = asString(data.services?.title, base.services.title);
  base.services.paragraphs = asLines(data.services?.paragraphs, base.services.paragraphs);
  base.services.items = asServices(data.services?.items, base.services.items);

  base.contactPage.title = asString(data.contactPage?.title, base.contactPage.title);
  base.contactPage.nameLabel = asString(data.contactPage?.nameLabel, base.contactPage.nameLabel);
  base.contactPage.emailLabel = asString(data.contactPage?.emailLabel, base.contactPage.emailLabel);
  base.contactPage.phoneLabel = asString(data.contactPage?.phoneLabel, base.contactPage.phoneLabel);
  base.contactPage.messageLabel = asString(data.contactPage?.messageLabel, base.contactPage.messageLabel);
  base.contactPage.submitLabel = asString(data.contactPage?.submitLabel, base.contactPage.submitLabel);

  return base;
}

function withSavedAssets(base: SiteContent, saved: SiteContent): SiteContent {
  const next = structuredClone(base);
  next.brand.logo = saved.brand.logo;
  next.contact = { ...saved.contact };
  next.social = saved.social.map((link) => {
    const current = next.social.find((item) => item.id === link.id);
    return current ? { ...current, href: link.href } : link;
  });
  next.home.hero.image = saved.home.hero.image;
  next.home.system.image = saved.home.system.image;
  next.services.items = next.services.items.map((item) => {
    const found = saved.services.items.find((entry) => entry.id === item.id);
    return found ? { ...item, icon: found.icon, image: found.image } : item;
  });
  return next;
}

export const getSiteContent = cache(async (locale?: Locale): Promise<SiteContent> => {
  await connection();
  const lang = locale ?? (await getLocale());
  let saved: SiteContent;
  try {
    const raw = await readFile(contentPath, "utf8");
    saved = mergeSiteContent(JSON.parse(raw) as unknown);
  } catch {
    saved = structuredClone(defaultSiteContent);
  }
  if (lang === "en") {
    return withSavedAssets(englishSiteContent, saved);
  }
  return saved;
});

export async function saveSiteContent(content: SiteContent) {
  await mkdir(path.dirname(contentPath), { recursive: true });
  await writeFile(contentPath, JSON.stringify(content, null, 2), "utf8");
}

const imageTypes = new Map([
  ["image/png", ".png"],
  ["image/jpeg", ".jpg"],
  ["image/webp", ".webp"],
]);

export async function saveUploadedImage(file: FormDataEntryValue | null, prefix: string) {
  if (!(file instanceof File) || file.size === 0) return null;
  if (file.size > 4 * 1024 * 1024) {
    throw new Error("La imagen supera 4 MB.");
  }
  const extension = imageTypes.get(file.type);
  if (!extension) {
    throw new Error("Usá una imagen PNG, JPG o WebP.");
  }

  const safePrefix = prefix.replace(/[^a-z0-9-]/gi, "").slice(0, 40) || "imagen";
  const filename = `${safePrefix}-${Date.now()}${extension}`;
  const directory = path.join(process.cwd(), "public", "uploads");
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, filename), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${filename}`;
}

export function publicAssetPath(value: string, fallback: string) {
  const next = value.trim();
  if (!next.startsWith("/") || next.includes("..") || next.includes("\\")) return fallback;
  return next;
}
