import { AdminCard, AdminFlash, Field, SaveButton } from "@/components/admin-form";
import { getSiteContent } from "@/content/site";

import { saveContactAction } from "../actions";

type SearchParams = Promise<{ error?: string; ok?: string }>;

export const instant = false;

export default async function AdminContactPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const site = await getSiteContent();
  const instagram = site.social.find((link) => link.id === "instagram")?.href ?? "";
  const linkedin = site.social.find((link) => link.id === "linkedin")?.href ?? "";

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Contacto</h1>
        <p className="mt-2 max-w-3xl text-black/70">
          El teléfono del pie y el botón de WhatsApp salen de acá. El enlace de WhatsApp es el que abre el chat.
        </p>
      </div>
      <AdminFlash ok={params.ok} error={params.error} />
      <form action={saveContactAction} className="space-y-6">
        <AdminCard title="Datos">
          <Field label="Email" name="email" type="email" defaultValue={site.contact.email} />
          <Field label="Teléfono visible" name="phoneDisplay" defaultValue={site.contact.phoneDisplay} />
          <Field label="Enlace del teléfono" name="phoneHref" defaultValue={site.contact.phoneHref} />
          <Field label="Enlace de WhatsApp" name="whatsappHref" defaultValue={site.contact.whatsappHref} />
          <Field label="Instagram" name="instagram" defaultValue={instagram} />
          <Field label="LinkedIn" name="linkedin" defaultValue={linkedin} />
        </AdminCard>
        <AdminCard title="Formulario">
          <Field label="Título de la página" name="title" defaultValue={site.contactPage.title} />
          <Field label="Etiqueta nombre" name="nameLabel" defaultValue={site.contactPage.nameLabel} />
          <Field label="Etiqueta email" name="emailLabel" defaultValue={site.contactPage.emailLabel} />
          <Field label="Etiqueta mensaje" name="messageLabel" defaultValue={site.contactPage.messageLabel} />
          <Field label="Botón enviar" name="submitLabel" defaultValue={site.contactPage.submitLabel} />
        </AdminCard>
        <SaveButton />
      </form>
    </div>
  );
}
