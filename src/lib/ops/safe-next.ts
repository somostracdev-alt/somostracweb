export function safeNext(value: unknown) {
  const next = String(value ?? "").trim();
  if (next.startsWith("/ops") || next.startsWith("/admin")) return next;
  return "";
}
