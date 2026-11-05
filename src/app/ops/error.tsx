"use client";

import { unstable_rethrow } from "next/navigation";

export default function OpsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  unstable_rethrow(error);

  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <h1 className="text-3xl font-semibold">No se pudo abrir la sala</h1>
      <p className="mt-4 text-sm leading-7 text-[#5c6560]">Reintentá o volvé al admin e ingresá de nuevo.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-full bg-[#2f3530] px-5 py-2 text-sm text-white"
      >
        Reintentar
      </button>
    </div>
  );
}
