import { AdminCard, AdminFlash, Area, Field, SaveButton } from "@/components/admin-form";
import { getSiteContent } from "@/content/site";

import { saveAboutAction } from "../actions";

type SearchParams = Promise<{ error?: string; ok?: string }>;

export const instant = false;

export default async function AdminAboutPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const about = (await getSiteContent()).about;

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
        <SaveButton />
      </form>
    </div>
  );
}
