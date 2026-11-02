import { AdminCard, AdminFlash, Area, Field, ImageField, SaveButton } from "@/components/admin-form";
import { getSiteContent } from "@/content/site";

import { saveHomeAction } from "../actions";

type SearchParams = Promise<{ error?: string; ok?: string }>;

export const instant = false;

export default async function AdminHomePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const { hero, install, system, why } = (await getSiteContent("es")).home;

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Inicio</h1>
        <p className="mt-2 max-w-3xl text-black/70">
          Un párrafo por línea. En el título del sistema, un salto de línea se ve en la home.
        </p>
      </div>
      <AdminFlash ok={params.ok} error={params.error} />
      <form action={saveHomeAction} className="space-y-6">
        <AdminCard title="Hero">
          <Field label="Prefijo" name="prefix" defaultValue={hero.prefix} />
          <Area
            label="Palabras que rotan"
            name="rotating"
            defaultValue={hero.rotating.join("\n")}
            hint="Una por línea."
            rows={4}
          />
          <Area label="Subtítulo" name="subtitle" defaultValue={hero.subtitle} rows={3} />
          <Area
            label="Párrafos"
            name="heroParagraphs"
            defaultValue={hero.paragraphs.join("\n")}
            hint="Uno por línea."
          />
          <ImageField label="Imagen del hero" name="heroImage" current={hero.image} />
        </AdminCard>
        <AdminCard title="Instalamos sistema comercial">
          <Field label="Título" name="installTitle" defaultValue={install.title} />
          <Area label="Párrafos" name="installParagraphs" defaultValue={install.paragraphs.join("\n")} hint="Uno por línea." />
          <Field label="Botón" name="installCtaLabel" defaultValue={install.ctaLabel} />
          <Field label="Enlace del botón" name="installCtaHref" defaultValue={install.ctaHref} />
        </AdminCard>
        <AdminCard title="Sistema y rueda">
          <Area label="Título" name="systemTitle" defaultValue={system.title} rows={3} />
          <ImageField label="Imagen de la rueda" name="systemImage" current={system.image} />
          <Field label="Botón" name="systemCtaLabel" defaultValue={system.ctaLabel} />
          <Field label="Enlace del botón" name="systemCtaHref" defaultValue={system.ctaHref} />
        </AdminCard>
        <AdminCard title="Por qué TRAC">
          <Field label="Título" name="whyTitle" defaultValue={why.title} />
          <Area label="Párrafos" name="whyParagraphs" defaultValue={why.paragraphs.join("\n")} hint="Uno por línea." />
        </AdminCard>
        <SaveButton />
      </form>
    </div>
  );
}
