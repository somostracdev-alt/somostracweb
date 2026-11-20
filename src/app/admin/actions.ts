"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { SiteContent } from "@/content/site";
import { isAdminAuthenticated } from "@/lib/admin-session";
import { getSiteContent, publicAssetPath, saveSiteContent, saveUploadedImage } from "@/lib/site-store";

function text(formData: FormData, name: string) {
  return String(formData.get(name) ?? "")
    .replace(/\r\n/g, "\n")
    .trim();
}

function lines(formData: FormData, name: string) {
  return text(formData, name)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function revalidateSite() {
  revalidatePath("/", "layout");
  revalidatePath("/quienes-somos");
  revalidatePath("/servicios");
  revalidatePath("/contacto");
  revalidatePath("/admin", "layout");
}

async function edit(redirectTo: string, update: (content: SiteContent) => Promise<void>) {
  if (!(await isAdminAuthenticated())) {
    redirect("/login?error=" + encodeURIComponent("Sesión de admin no válida"));
  }

  const content = await getSiteContent("es");
  try {
    await update(content);
    await saveSiteContent(content);
  } catch (error) {
    console.error("[admin] guardar", error);
    const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
    const message =
      code === "EROFS" || code === "EPERM" || code === "ENOENT"
        ? "Este hosting no puede guardar archivos locales. Creá un Blob store en Vercel (Storage → Blob) y redesplegá."
        : error instanceof Error
          ? error.message
          : "No se pudo guardar. Probá de nuevo.";
    redirect(`${redirectTo}?error=${encodeURIComponent(message)}`);
  }

  revalidateSite();
  redirect(`${redirectTo}?ok=${encodeURIComponent("Cambios guardados.")}`);
}

async function imageValue(formData: FormData, name: string, fallback: string) {
  const uploaded = await saveUploadedImage(formData.get(`${name}File`), name);
  if (uploaded) return uploaded;
  return publicAssetPath(text(formData, name), fallback);
}

export async function saveContactAction(formData: FormData) {
  await edit("/admin/contacto", async (content) => {
    content.contact.email = text(formData, "email");
    content.contact.phoneDisplay = text(formData, "phoneDisplay");
    content.contact.phoneHref = text(formData, "phoneHref");
    content.contact.whatsappHref = text(formData, "whatsappHref");
    content.social = content.social.map((link) => {
      if (link.id === "instagram") return { ...link, href: text(formData, "instagram") };
      if (link.id === "linkedin") return { ...link, href: text(formData, "linkedin") };
      return link;
    });
    const page = content.contactPage;
    page.title = text(formData, "title");
    page.intro = text(formData, "intro");
    page.stepsTitle = text(formData, "stepsTitle");
    page.steps = lines(formData, "steps");
    page.whatsappButton = text(formData, "whatsappButton");
    page.nameLabel = text(formData, "nameLabel");
    page.companyLabel = text(formData, "companyLabel");
    page.sectorLabel = text(formData, "sectorLabel");
    page.sectors = lines(formData, "sectors");
    page.whatsappLabel = text(formData, "whatsappLabel");
    page.emailLabel = text(formData, "emailLabel");
    page.zoneLabel = text(formData, "zoneLabel");
    page.messageLabel = text(formData, "messageLabel");
    page.messagePlaceholder = text(formData, "messagePlaceholder");
    page.submitLabel = text(formData, "submitLabel");
    page.privacy = text(formData, "privacy");
    page.success = text(formData, "success");
  });
}

export async function saveHomeAction(formData: FormData) {
  await edit("/admin/inicio", async (content) => {
    const hero = content.home.hero;
    hero.prefix = text(formData, "prefix");
    hero.rotating = lines(formData, "rotating");
    hero.subtitle = text(formData, "subtitle");
    hero.paragraphs = lines(formData, "heroParagraphs");
    hero.image = await imageValue(formData, "heroImage", hero.image);
    hero.primaryLabel = text(formData, "primaryLabel");
    hero.primaryHref = text(formData, "primaryHref") || "/contacto";
    hero.secondaryLabel = text(formData, "secondaryLabel");

    content.home.install.title = text(formData, "installTitle");
    content.home.install.paragraphs = lines(formData, "installParagraphs");
    content.home.install.stages = lines(formData, "installStages");
    content.home.install.ctaLabel = text(formData, "installCtaLabel");
    content.home.install.ctaHref = text(formData, "installCtaHref") || "/contacto";

    content.home.system.title = text(formData, "systemTitle");
    content.home.system.image = await imageValue(formData, "systemImage", content.home.system.image);
    content.home.system.ctaLabel = text(formData, "systemCtaLabel");
    content.home.system.ctaHref = text(formData, "systemCtaHref") || "/servicios";

    content.home.sectors.title = text(formData, "sectorsTitle");
    content.home.sectors.items = lines(formData, "sectorsItems");
    content.home.sectors.close = text(formData, "sectorsClose");

    content.home.why.title = text(formData, "whyTitle");
    content.home.why.paragraphs = lines(formData, "whyParagraphs");
    content.home.why.statValue = text(formData, "statValue");
    content.home.why.statText = text(formData, "statText");
    content.home.why.statSource = text(formData, "statSource");
    content.home.why.ctaLabel = text(formData, "whyCtaLabel");
    content.home.why.ctaHref = text(formData, "whyCtaHref") || "/contacto";

    content.home.close.title = text(formData, "closeTitle");
    content.home.close.text = text(formData, "closeText");
    content.home.close.ctaLabel = text(formData, "closeLabel");
    content.home.close.ctaHref = text(formData, "closeHref") || "/contacto";
  });
}

export async function saveAboutAction(formData: FormData) {
  await edit("/admin/quienes-somos", async (content) => {
    content.about.title = text(formData, "title");
    content.about.paragraphs = lines(formData, "paragraphs");
    content.about.storyTitle = text(formData, "storyTitle");
    content.about.storyParagraphs = lines(formData, "storyParagraphs");
    content.about.principlesTitle = text(formData, "principlesTitle");
    content.about.principles = content.about.principles.map((item, index) => ({
      title: text(formData, `principleTitle-${index}`) || item.title,
      text: text(formData, `principleText-${index}`) || item.text,
    }));
    content.about.teamTitle = text(formData, "teamTitle");
    content.about.team = content.about.team.map((item, index) => ({
      title: text(formData, `teamTitle-${index}`) || item.title,
      text: text(formData, `teamText-${index}`) || item.text,
    }));
    content.about.teamNote = text(formData, "teamNote");
    content.about.closeTitle = text(formData, "closeTitle");
    content.about.closeText = text(formData, "closeText");
    content.about.closeLabel = text(formData, "closeLabel");
    content.about.closeHref = text(formData, "closeHref") || "/contacto";
  });
}

export async function saveServicesAction(formData: FormData) {
  await edit("/admin/servicios", async (content) => {
    content.services.title = text(formData, "title");
    content.services.paragraphs = lines(formData, "paragraphs");
    content.services.items = await Promise.all(
      content.services.items.map(async (item) => ({
        ...item,
        title: text(formData, `${item.id}Title`),
        summary: text(formData, `${item.id}Summary`),
        lead: text(formData, `${item.id}Lead`),
        points: lines(formData, `${item.id}Points`),
        closing: text(formData, `${item.id}Closing`),
        icon: await imageValue(formData, `${item.id}Icon`, item.icon),
        image: await imageValue(formData, `${item.id}Image`, item.image),
      })),
    );
    content.services.closeTitle = text(formData, "closeTitle");
    content.services.closeText = text(formData, "closeText");
    content.services.closeLabel = text(formData, "closeLabel");
    content.services.closeHref = text(formData, "closeHref") || "/contacto";
  });
}

export async function saveSiteChromeAction(formData: FormData) {
  await edit("/admin/sitio", async (content) => {
    content.brand.name = text(formData, "brandName") || content.brand.name;
    content.brand.logo = await imageValue(formData, "logo", content.brand.logo);
    content.navigation = content.navigation.map((link) => ({
      ...link,
      label: text(formData, `nav-${link.id}`) || link.label,
    }));
    content.footer.summary = text(formData, "summary");
    content.footer.tagline = text(formData, "tagline");
    content.footer.linksTitle = text(formData, "linksTitle");
    content.footer.contactTitle = text(formData, "contactTitle");
    content.footer.copyright = text(formData, "copyright");
    content.footer.links = content.footer.links.map((link) => ({
      ...link,
      label: text(formData, `footer-${link.id}`) || link.label,
    }));
  });
}
