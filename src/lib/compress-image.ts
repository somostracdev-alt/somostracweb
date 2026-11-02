const maxBytes = 350_000;
const maxEdge = 1600;

function blobToFile(blob: Blob, name: string, type: string) {
  const extension = type === "image/webp" ? "webp" : type === "image/png" ? "png" : "jpg";
  return new File([blob], name.replace(/\.[^.]+$/, "") + "." + extension, {
    type,
    lastModified: Date.now(),
  });
}

export async function compressImageFile(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.size === 0) return file;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file;
  }

  try {
    if (file.size <= maxBytes && Math.max(bitmap.width, bitmap.height) <= maxEdge) {
      return file;
    }

    const keepAlpha = file.type === "image/png" || file.type === "image/webp";
    let type = keepAlpha ? "image/webp" : "image/jpeg";
    let quality = 0.82;
    let width = bitmap.width;
    let height = bitmap.height;
    const scale = Math.min(1, maxEdge / Math.max(width, height));
    width = Math.max(1, Math.round(width * scale));
    height = Math.max(1, Math.round(height * scale));

    let lastBlob: Blob | null = null;

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) return file;
      if (!keepAlpha) {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, width, height);
      }
      context.drawImage(bitmap, 0, 0, width, height);

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, type, quality);
      });

      if (!blob) {
        if (type !== "image/jpeg") {
          type = "image/jpeg";
          continue;
        }
        break;
      }

      lastBlob = blob;
      if (blob.size <= maxBytes || attempt === 4) {
        return blobToFile(blob, file.name, type);
      }

      quality = Math.max(0.5, quality - 0.12);
      width = Math.max(1, Math.round(width * 0.85));
      height = Math.max(1, Math.round(height * 0.85));
    }

    return lastBlob ? blobToFile(lastBlob, file.name, type) : file;
  } finally {
    bitmap.close();
  }
}
