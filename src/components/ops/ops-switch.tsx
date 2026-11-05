import Link from "next/link";

export function OpsSwitch({ client, current }: { client: string; current: "calendario" | "pauta" }) {
  const item = (href: string, label: string, active: boolean) => (
    <Link
      href={href}
      className={`rounded-full px-3 py-1 text-sm ${active ? "bg-[#2a302c] text-[#f7f5f0]" : "border border-[#cfd4cc] bg-[#f3f1eb] text-[#2a302c]"}`}
    >
      {label}
    </Link>
  );

  return (
    <div className="mt-3 flex gap-2">
      {item(`/ops?client=${encodeURIComponent(client)}`, "Calendario", current === "calendario")}
      {item(`/ops/pauta?client=${encodeURIComponent(client)}`, "Pauta", current === "pauta")}
    </div>
  );
}
