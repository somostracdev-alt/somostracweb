import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-session";
import { addOpsPieceFile } from "@/lib/ops/queries";
import { pieceMedia, rejectionReason } from "@/lib/ops/piece-media";
import { blobToken, blobUploadsEnabled, discardStoredFile, savePieceFileLocally } from "@/lib/ops/piece-storage";

const pieceIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function allowedTypes() {
  return [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "video/mp4",
    "video/webm",
    "video/quicktime",
  ];
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Tenés que entrar de nuevo." }, { status: 401 });
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    if (!blobUploadsEnabled()) {
      return NextResponse.json({ error: "Falta el almacenamiento de archivos." }, { status: 400 });
    }
    const body = (await request.json()) as HandleUploadBody;
    try {
      const result = await handleUpload({
        body,
        request,
        token: blobToken(),
        onBeforeGenerateToken: async (pathname) => {
          if (!pathname.startsWith("ops/piezas/") || pathname.includes("..")) {
            throw new Error("No se puede guardar ese archivo.");
          }
          return {
            allowedContentTypes: allowedTypes(),
            maximumSizeInBytes: pieceMedia.maxVideoBytes,
            addRandomSuffix: true,
          };
        },
      });
      return NextResponse.json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo preparar la subida.";
      return NextResponse.json({ error: message }, { status: 400 });
    }
  }

  const formData = await request.formData();
  const pieceId = String(formData.get("pieceId") ?? "");
  const file = formData.get("file");
  if (!pieceIdPattern.test(pieceId) || !(file instanceof File)) {
    return NextResponse.json({ error: "Falta el archivo." }, { status: 400 });
  }
  const reason = rejectionReason(
    { type: file.type, size: file.size },
    { blob: false, already: 0, alreadyBytes: 0 },
  );
  if (reason) return NextResponse.json({ error: reason }, { status: 400 });

  let url = "";
  try {
    url = await savePieceFileLocally(pieceId, file);
    const saved = await addOpsPieceFile({
      pieceId,
      url,
      filename: file.name,
      contentType: file.type,
      sizeBytes: file.size,
    });
    return NextResponse.json({ file: saved });
  } catch (error) {
    if (url) await discardStoredFile(url);
    const message = error instanceof Error ? error.message : "No se pudo guardar el archivo.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
