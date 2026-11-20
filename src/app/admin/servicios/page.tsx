import { AdminCard, AdminFlash, AdminForm, Area, Field, ImageField, SaveButton } from "@/components/admin-form";
import { getSiteContent } from "@/content/site";

import { saveServicesAction } from "../actions";

type SearchParams = Promise<{ error?: string; ok?: string }>;

export const instant = false;

export default async function AdminServicesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const services = (await getSiteContent("es")).services;

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Servicios</h1>
        <p className="mt-2 max-w-3xl text-black/70">
          Estas tarjetas se ven en Inicio y en la página de Servicios. La imagen aparece en Servicios. Un párrafo por línea.
        </p>
      </div>
      <AdminFlash ok={params.ok} error={params.error} />
      <AdminForm action={saveServicesAction} className="space-y-6">
        <AdminCard title="Introducción">
          <Field label="Título" name="title" defaultValue={services.title} />
          <Area label="Párrafos" name="paragraphs" defaultValue={services.paragraphs.join("\n")} />
        </AdminCard>
        {services.items.map((item) => (
          <AdminCard key={item.id} title={item.title}>
            <Field label="Título" name={`${item.id}Title`} defaultValue={item.title} />
            <Area label="Texto en la home" name={`${item.id}Summary`} defaultValue={item.summary} rows={3} />
            <Area label="Frase de apertura" name={`${item.id}Lead`} defaultValue={item.lead} rows={2} />
            <Area label="Puntos" name={`${item.id}Points`} defaultValue={item.points.join("\n")} hint="Uno por línea." />
            <Area label="Cierre" name={`${item.id}Closing`} defaultValue={item.closing} rows={2} />
            <ImageField label="Ícono" name={`${item.id}Icon`} current={item.icon} />
            <ImageField label="Imagen" name={`${item.id}Image`} current={item.image} wide />
          </AdminCard>
        ))}
        <AdminCard title="Cierre">
          <Field label="Título" name="closeTitle" defaultValue={services.closeTitle} />
          <Area label="Texto" name="closeText" defaultValue={services.closeText} rows={3} />
          <Field label="Botón" name="closeLabel" defaultValue={services.closeLabel} />
          <Field label="Enlace del botón" name="closeHref" defaultValue={services.closeHref} />
        </AdminCard>
        <SaveButton />
      </AdminForm>
    </div>
  );
}
