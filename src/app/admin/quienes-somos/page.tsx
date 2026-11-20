import { AdminCard, AdminFlash, Area, Field, SaveButton } from "@/components/admin-form";
import { getSiteContent } from "@/content/site";

import { saveAboutAction } from "../actions";

type SearchParams = Promise<{ error?: string; ok?: string }>;

export const instant = false;

export default async function AdminAboutPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const about = (await getSiteContent("es")).about;

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Quiénes somos</h1>
        <p className="mt-2 max-w-3xl text-black/70">Un párrafo por línea.</p>
      </div>
      <AdminFlash ok={params.ok} error={params.error} />
      <form action={saveAboutAction} className="space-y-6">
        <AdminCard title="Apertura">
          <Field label="Título" name="title" defaultValue={about.title} />
          <Area label="Párrafos" name="paragraphs" defaultValue={about.paragraphs.join("\n")} />
        </AdminCard>
        <AdminCard title="Historia">
          <Field label="Título" name="storyTitle" defaultValue={about.storyTitle} />
          <Area label="Párrafos" name="storyParagraphs" defaultValue={about.storyParagraphs.join("\n")} />
        </AdminCard>
        <AdminCard title="Cómo trabajamos">
          <Field label="Título" name="principlesTitle" defaultValue={about.principlesTitle} />
          {about.principles.map((item, index) => (
            <div key={item.title} className="space-y-4 border-t border-black/10 pt-4">
              <Field label={`Principio ${index + 1}`} name={`principleTitle-${index}`} defaultValue={item.title} />
              <Area label="Texto" name={`principleText-${index}`} defaultValue={item.text} rows={3} />
            </div>
          ))}
        </AdminCard>
        <AdminCard title="Equipo">
          <Field label="Título" name="teamTitle" defaultValue={about.teamTitle} />
          {about.team.map((item, index) => (
            <div key={item.title} className="space-y-4 border-t border-black/10 pt-4">
              <Field label={`Rol ${index + 1}`} name={`teamTitle-${index}`} defaultValue={item.title} />
              <Area label="Texto" name={`teamText-${index}`} defaultValue={item.text} rows={3} />
            </div>
          ))}
          <Area label="Nota" name="teamNote" defaultValue={about.teamNote} rows={2} />
        </AdminCard>
        <AdminCard title="Cierre">
          <Field label="Título" name="closeTitle" defaultValue={about.closeTitle} />
          <Area label="Texto" name="closeText" defaultValue={about.closeText} rows={3} />
          <Field label="Botón" name="closeLabel" defaultValue={about.closeLabel} />
          <Field label="Enlace del botón" name="closeHref" defaultValue={about.closeHref} />
        </AdminCard>
        <SaveButton />
      </form>
    </div>
  );
}
