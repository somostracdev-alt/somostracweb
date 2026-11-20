import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { del } from "@vercel/blob";

function blobCredentials() {
  const tokenKey = Object.keys(process.env).find((key) => key.endsWith("BLOB_READ_WRITE_TOKEN"));
  const storeKey = Object.keys(process.env).find((key) => key.endsWith("BLOB_STORE_ID"));
  return {
    token: tokenKey ? process.env[tokenKey] : undefined,
    storeId: storeKey ? process.env[storeKey] : undefined,
  };
}

export function blobUploadsEnabled() {
  return Boolean(blobCredentials().token);
}

function blobOptions() {
  const { token, storeId } = blobCredentials();
  return {
    ...(token ? { token } : {}),
    ...(storeId ? { storeId } : {}),
  };
}

export async function discardStoredFile(url: string) {
  if (url.startsWith("/uploads/ops/") && !url.includes("..")) {
    const relative = url.replace(/^\/+/, "");
    await unlink(path.join(process.cwd(), "public", relative)).catch(() => undefined);
    return;
  }
  if (!blobUploadsEnabled()) return;
  if (!url.startsWith("https://") || !url.includes(".public.blob.vercel-storage.com/")) return;
  await del(url, blobOptions()).catch(() => undefined);
}

export async function savePieceFileLocally(pieceId: string, file: File) {
  const extension = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")).toLowerCase() : "";
  const safeExtension = /^\.[a-z0-9]{1,5}$/.test(extension) ? extension : "";
  const filename = `${Date.now()}${safeExtension}`;
  const directory = path.join(process.cwd(), "public", "uploads", "ops", pieceId);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, filename), Buffer.from(await file.arrayBuffer()));
  return `/uploads/ops/${pieceId}/${filename}`;
}

export function blobToken() {
  return blobCredentials().token;
}
