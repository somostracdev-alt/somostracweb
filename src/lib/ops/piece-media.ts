export const pieceMedia = {
  maxFiles: 6,
  maxImageBytes: 4 * 1024 * 1024,
  maxVideoBytes: 12 * 1024 * 1024,
  localVideoBytes: 4 * 1024 * 1024,
  maxPieceBytes: 24 * 1024 * 1024,
};

const imageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const videoTypes = new Set(["video/mp4", "video/webm", "video/quicktime"]);

export const pieceMediaAccept = [...imageTypes, ...videoTypes].join(",");

export function pieceMediaKind(type: string) {
  if (imageTypes.has(type)) return "image" as const;
  if (videoTypes.has(type)) return "video" as const;
  return null;
}

export function formatPieceBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  const megabytes = Math.round((bytes / (1024 * 1024)) * 10) / 10;
  return `${Number.isInteger(megabytes) ? megabytes.toFixed(0) : megabytes} MB`;
}

export function rejectionReason(
  file: { type: string; size: number },
  options: { blob: boolean; already: number; alreadyBytes: number },
) {
  if (!file.size) return "El archivo está vacío.";
  const kind = pieceMediaKind(file.type);
  if (!kind) return "Ese formato no sirve. Usá JPG, PNG, WebP, GIF, MP4, WebM o MOV.";
  if (options.already >= pieceMedia.maxFiles) {
    return `Cada pieza acepta hasta ${pieceMedia.maxFiles} archivos.`;
  }
  const cap = kind === "image" ? pieceMedia.maxImageBytes : options.blob ? pieceMedia.maxVideoBytes : pieceMedia.localVideoBytes;
  if (file.size > cap) {
    if (kind === "image") return `La foto supera ${formatPieceBytes(pieceMedia.maxImageBytes)}.`;
    if (!options.blob) {
      return `Este video supera ${formatPieceBytes(pieceMedia.localVideoBytes)}. En esta computadora el tope por video es ese.`;
    }
    return `El video supera ${formatPieceBytes(pieceMedia.maxVideoBytes)}.`;
  }
  if (options.alreadyBytes + file.size > pieceMedia.maxPieceBytes) {
    return `La pieza no puede pasar de ${formatPieceBytes(pieceMedia.maxPieceBytes)} entre todos los archivos.`;
  }
  return null;
}

export function acceptablePieceFileUrl(url: string) {
  if (url.startsWith("/uploads/ops/") && !url.includes("..") && !url.includes("\\")) return true;
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      parsed.hostname.endsWith(".public.blob.vercel-storage.com") &&
      parsed.pathname.startsWith("/ops/piezas/")
    );
  } catch {
    return false;
  }
}
