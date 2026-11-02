import { AdminCard, AdminFlash, Field, ImageField, SaveButton } from "@/components/admin-form";
import { getSiteContent } from "@/content/site";

import { saveSiteChromeAction } from "../actions";

type SearchParams = Promise<{ error?: string; ok?: string }>;

export default async function AdminSitePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const site = await getSiteContent();

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Menú y pie</h1>
        <p className="mt-2 max-w-3xl text-black/70">
          Los enlaces del menú y del pie siguen yendo a las mismas páginas. Acá se cambia el texto y el logo.
        </p>
      </div>
      <AdminFlash ok={params.ok} error={params.error} />
      <form action={saveSiteChromeAction} className="space-y-6">
        <AdminCard title="Marca">
          <Field label="Nombre" name="brandName" defaultValue={site.brand.name} />
          <ImageField label="Logo" name="logo" current={site.brand.logo} />
        </AdminCard>
        <AdminCard title="Menú">
          {site.navigation.map((link) => (
            <Field key={link.id} label={link.href} name={`nav-${link.id}`} defaultValue={link.label} />
          ))}
        </AdminCard>
        <AdminCard title="Pie">
          <Field label="Tagline" name="tagline" defaultValue={site.footer.tagline} />
          <Field label="Título de links" name="linksTitle" defaultValue={site.footer.linksTitle} />
          <Field label="Título de contacto" name="contactTitle" defaultValue={site.footer.contactTitle} />
          <Field label="Copyright" name="copyright" defaultValue={site.footer.copyright} />
          {site.footer.links.map((link) => (
            <Field key={link.id} label={`Pie ${link.href}`} name={`footer-${link.id}`} defaultValue={link.label} />
          ))}
        </AdminCard>
        <SaveButton />
      </form>
    </div>
  );
}
