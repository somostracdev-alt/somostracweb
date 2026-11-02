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

  const content = await getSiteContent();
  try {
    await update(content);
    await saveSiteContent(content);
  } catch (error) {
    console.error("[admin] guardar", error);
    const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
    const message =
      code === "EROFS" || code === "EPERM"
        ? "Este hosting no puede guardar archivos. El panel funciona en local; en Vercel hace falta una base."
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
    content.contactPage.title = text(formData, "title");
    content.contactPage.nameLabel = text(formData, "nameLabel");
    content.contactPage.emailLabel = text(formData, "emailLabel");
    content.contactPage.messageLabel = text(formData, "messageLabel");
    content.contactPage.submitLabel = text(formData, "submitLabel");
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

    content.home.install.title = text(formData, "installTitle");
    content.home.install.paragraphs = lines(formData, "installParagraphs");
    content.home.install.ctaLabel = text(formData, "installCtaLabel");
    content.home.install.ctaHref = text(formData, "installCtaHref") || "/contacto";

    content.home.system.title = text(formData, "systemTitle");
    content.home.system.image = await imageValue(formData, "systemImage", content.home.system.image);
    content.home.system.ctaLabel = text(formData, "systemCtaLabel");
    content.home.system.ctaHref = text(formData, "systemCtaHref") || "/servicios";

    content.home.why.title = text(formData, "whyTitle");
    content.home.why.paragraphs = lines(formData, "whyParagraphs");
  });
}

export async function saveAboutAction(formData: FormData) {
  await edit("/admin/quienes-somos", async (content) => {
    content.about.title = text(formData, "title");
    content.about.paragraphs = lines(formData, "paragraphs");
    content.about.storyTitle = text(formData, "storyTitle");
    content.about.storyParagraphs = lines(formData, "storyParagraphs");
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
        paragraphs: lines(formData, `${item.id}Paragraphs`),
        icon: await imageValue(formData, `${item.id}Icon`, item.icon),
      })),
    );
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
