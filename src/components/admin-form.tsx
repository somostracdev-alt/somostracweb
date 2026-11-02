"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

import { compressImageFile } from "@/lib/compress-image";

export function AdminFlash({ ok, error }: { ok?: string; error?: string }) {
  return (
    <>
      {ok ? <p className="mb-4 rounded-xl bg-emerald-100 px-4 py-2 text-sm text-emerald-950">{ok}</p> : null}
      {error ? <p className="mb-4 rounded-xl bg-red-100 px-4 py-2 text-sm text-red-950">{error}</p> : null}
    </>
  );
}

export function AdminCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-2xl border border-black/10 p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

const controlClass = "rounded-xl border border-black/20 bg-white px-4 py-2 text-black";

export function Field({
  label,
  name,
  defaultValue,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue: string;
  type?: string;
}) {
  return (
    <label className="grid gap-1 text-sm">
      {label}
      <input name={name} type={type} defaultValue={defaultValue} className={controlClass} />
    </label>
  );
}

export function Area({
  label,
  name,
  defaultValue,
  hint,
  rows = 5,
}: {
  label: string;
  name: string;
  defaultValue: string;
  hint?: string;
  rows?: number;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span>{label}</span>
      {hint ? <span className="text-xs text-black/50">{hint}</span> : null}
      <textarea name={name} defaultValue={defaultValue} rows={rows} className={controlClass} />
    </label>
  );
}

export function ImageField({
  label,
  name,
  current,
  wide = false,
}: {
  label: string;
  name: string;
  current: string;
  wide?: boolean;
}) {
  return (
    <div className="grid gap-2 text-sm">
      <span>{label}</span>
      {current ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={current}
          alt=""
          className={wide ? "h-32 w-full max-w-md object-cover" : "h-20 w-auto max-w-full object-contain"}
        />
      ) : null}
      <input name={name} type="text" defaultValue={current} className={controlClass} />
      <input name={`${name}File`} type="file" accept="image/png,image/jpeg,image/webp" className="text-sm" />
      <span className="text-xs text-black/50">Las fotos pesadas se comprimen solas al guardar.</span>
    </div>
  );
}

export function AdminForm({
  action,
  children,
  className,
}: {
  action: (formData: FormData) => void | Promise<void>;
  children: React.ReactNode;
  className?: string;
}) {
  const [error, setError] = useState<string | null>(null);

  async function submit(formData: FormData) {
    setError(null);
    const next = new FormData();
    try {
      for (const [key, value] of formData.entries()) {
        if (value instanceof File && value.size > 0) {
          next.append(key, await compressImageFile(value));
        } else {
          next.append(key, value);
        }
      }
    } catch {
      setError("No se pudo preparar la imagen. Probá un JPG más chico.");
      return;
    }

    try {
      await action(next);
    } catch (caught) {
      const digest =
        caught && typeof caught === "object" && "digest" in caught ? String(caught.digest) : "";
      if (digest.startsWith("NEXT_REDIRECT")) throw caught;
      setError("La foto es demasiado pesada para el servidor. Probá un JPG más chico.");
    }
  }

  return (
    <form action={submit} className={className}>
      {error ? <p className="mb-4 rounded-xl bg-red-100 px-4 py-2 text-sm text-red-950">{error}</p> : null}
      {children}
    </form>
  );
}

export function SaveButton({ label = "Guardar" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-accent px-5 py-2 text-sm uppercase tracking-wide text-white disabled:opacity-60"
    >
      {pending ? "Guardando..." : label}
    </button>
  );
}
