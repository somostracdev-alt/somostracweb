import Link from "next/link";

import { AdminFlash } from "@/components/admin-form";

type SearchParams = Promise<{ error?: string; ok?: string }>;

export const instant = false;

const sections = [
  {
    href: "/admin/contacto",
    title: "Contacto",
    text: "Mail, teléfono, WhatsApp, Instagram, LinkedIn y las etiquetas del formulario.",
  },
  {
    href: "/admin/inicio",
    title: "Inicio",
    text: "Hero, textos que rotan, sistema comercial, rueda y el bloque Por qué TRAC.",
  },
  {
    href: "/admin/quienes-somos",
    title: "Quiénes somos",
    text: "Título, bajada y la historia de la página.",
  },
  {
    href: "/admin/servicios",
    title: "Servicios",
    text: "Introducción y las cuatro tarjetas, con título, texto e ícono.",
  },
  {
    href: "/admin/sitio",
    title: "Menú y footer",
    text: "Logo, nombre, textos del menú, tagline y copyright.",
  },
];

export default async function AdminPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Inicio</h1>
        <p className="mt-2 max-w-3xl text-black/70">
          Editá los textos, teléfonos y fotos del sitio. Guardar actualiza la página pública en este servidor.
        </p>
      </div>
      <AdminFlash ok={params.ok} error={params.error} />
      <div className="grid gap-4 md:grid-cols-2">
        <a
          href="/ops"
          target="_blank"
          rel="noreferrer"
          className="rounded-2xl border border-black/10 p-6 hover:border-black/30"
        >
          <h2 className="text-lg font-semibold">Calendario</h2>
          <p className="mt-2 text-sm text-black/70">
            Se abre en otra ventana. Ahí se arma el calendario de cada cliente, sin Excel.
          </p>
        </a>
        <a
          href="/ops/pauta"
          target="_blank"
          rel="noreferrer"
          className="rounded-2xl border border-black/10 p-6 hover:border-black/30"
        >
          <h2 className="text-lg font-semibold">Pauta</h2>
          <p className="mt-2 text-sm text-black/70">
            Campañas, conjuntos y anuncios de Meta. Gallagro ya tiene noviembre y diciembre.
          </p>
        </a>
        {sections.map((section) => (
          <Link key={section.href} href={section.href} className="rounded-2xl border border-black/10 p-6 hover:border-black/30">
            <h2 className="text-lg font-semibold">{section.title}</h2>
            <p className="mt-2 text-sm text-black/70">{section.text}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
