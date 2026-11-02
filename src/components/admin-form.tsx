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

export function ImageField({ label, name, current }: { label: string; name: string; current: string }) {
  return (
    <div className="grid gap-2 text-sm">
      <span>{label}</span>
      {current ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={current} alt="" className="h-20 w-auto max-w-full object-contain" />
      ) : null}
      <input name={name} type="text" defaultValue={current} className={controlClass} />
      <input name={`${name}File`} type="file" accept="image/png,image/jpeg,image/webp" className="text-sm" />
    </div>
  );
}

export function SaveButton({ label = "Guardar" }: { label?: string }) {
  return (
    <button type="submit" className="rounded-full bg-black px-5 py-2 text-sm uppercase tracking-wide text-white">
      {label}
    </button>
  );
}
