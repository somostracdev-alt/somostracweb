import { AdminCard, AdminFlash, AdminForm, Area, Field, ImageField, SaveButton } from "@/components/admin-form";
import { getSiteContent } from "@/content/site";

import { saveHomeAction } from "../actions";

type SearchParams = Promise<{ error?: string; ok?: string }>;

export const instant = false;

export default async function AdminHomePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const { hero, install, system, sectors, why, close } = (await getSiteContent("es")).home;

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Inicio</h1>
        <p className="mt-2 max-w-3xl text-black/70">
          Un párrafo por línea. En el título del sistema, un salto de línea se ve en la home.
        </p>
      </div>
      <AdminFlash ok={params.ok} error={params.error} />
      <AdminForm action={saveHomeAction} className="space-y-6">
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
          <Field label="Botón principal" name="primaryLabel" defaultValue={hero.primaryLabel} />
          <Field label="Enlace del botón principal" name="primaryHref" defaultValue={hero.primaryHref} />
          <Field label="Botón de WhatsApp" name="secondaryLabel" defaultValue={hero.secondaryLabel} />
        </AdminCard>
        <AdminCard title="Instalamos sistema comercial">
          <Field label="Título" name="installTitle" defaultValue={install.title} />
          <Area label="Párrafos" name="installParagraphs" defaultValue={install.paragraphs.join("\n")} hint="Uno por línea." />
          <Area label="Etapas" name="installStages" defaultValue={install.stages.join("\n")} hint="Una por línea. Se ven en verde debajo del texto." />
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
          <Field label="Dato" name="statValue" defaultValue={why.statValue} />
          <Area label="Texto del dato" name="statText" defaultValue={why.statText} rows={3} />
          <Field label="Fuente" name="statSource" defaultValue={why.statSource} />
          <Field label="Botón" name="whyCtaLabel" defaultValue={why.ctaLabel} />
          <Field label="Enlace del botón" name="whyCtaHref" defaultValue={why.ctaHref} />
        </AdminCard>
        <AdminCard title="Con quién trabajamos">
          <Field label="Título" name="sectorsTitle" defaultValue={sectors.title} />
          <Area label="Bloques" name="sectorsItems" defaultValue={sectors.items.join("\n")} hint="Uno por línea." />
          <Area label="Cierre" name="sectorsClose" defaultValue={sectors.close} rows={3} />
        </AdminCard>
        <AdminCard title="Cierre de la home">
          <Field label="Título" name="closeTitle" defaultValue={close.title} />
          <Area label="Texto" name="closeText" defaultValue={close.text} rows={3} />
          <Field label="Botón" name="closeLabel" defaultValue={close.ctaLabel} />
          <Field label="Enlace del botón" name="closeHref" defaultValue={close.ctaHref} />
        </AdminCard>
        <SaveButton />
      </AdminForm>
    </div>
  );
}
