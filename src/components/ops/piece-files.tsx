"use client";

import { useEffect, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";

import { addOpsPieceFileAction, removeOpsPieceFileAction } from "@/app/ops/actions";
import { compressImageFile } from "@/lib/compress-image";
import {
  formatPieceBytes,
  pieceMedia,
  pieceMediaAccept,
  pieceMediaKind,
  rejectionReason,
} from "@/lib/ops/piece-media";
import type { OpsPieceFile } from "@/lib/ops/queries";

type PendingFile = {
  key: string;
  file: File;
  url: string;
};

function MediaFrame({ url, type, name }: { url: string; type: string; name: string }) {
  if (pieceMediaKind(type) === "video") {
    return <video src={url} controls muted playsInline className="h-36 w-full bg-[#1c211e] object-contain" />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt={name} className="h-36 w-full object-cover" />
  );
}

export function PieceFileGallery({ files }: { files: OpsPieceFile[] }) {
  if (!files.length) return null;
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b726c]">Archivos</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {files.map((file) => (
          <a
            key={file.id}
            href={file.url}
            target="_blank"
            rel="noreferrer"
            className="overflow-hidden rounded-xl border border-[#d5d8d1]"
          >
            <MediaFrame url={file.url} type={file.contentType} name={file.filename || "Archivo"} />
          </a>
        ))}
      </div>
    </div>
  );
}

export function PieceFileThumb({ file }: { file?: OpsPieceFile }) {
  if (!file) return null;
  if (pieceMediaKind(file.contentType) === "image") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={file.url} alt="" className="ops-chip-thumb" />
    );
  }
  return <span className="ops-chip-play" aria-hidden="true" />;
}

export function PieceFileField({
  files,
  blobUploads,
  removedIds,
  pending,
  onRemoveExisting,
  onRestoreExisting,
  onPending,
}: {
  files: OpsPieceFile[];
  blobUploads: boolean;
  removedIds: string[];
  pending: PendingFile[];
  onRemoveExisting: (id: string) => void;
  onRestoreExisting: (id: string) => void;
  onPending: (next: PendingFile[]) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const pendingRef = useRef(pending);
  pendingRef.current = pending;
  const kept = files.filter((file) => !removedIds.includes(file.id));
  const removed = files.filter((file) => removedIds.includes(file.id));
  const videoCap = blobUploads ? pieceMedia.maxVideoBytes : pieceMedia.localVideoBytes;

  useEffect(() => {
    return () => {
      for (const item of pendingRef.current) URL.revokeObjectURL(item.url);
    };
  }, []);

  function addFiles(list: FileList | null) {
    if (!list?.length) return;
    const next = [...pending];
    let message: string | null = null;
    for (const file of list) {
      const reason = rejectionReason(
        { type: file.type, size: file.size },
        {
          blob: blobUploads,
          already: kept.length + next.length,
          alreadyBytes: kept.reduce((sum, item) => sum + item.sizeBytes, 0) + next.reduce((sum, item) => sum + item.file.size, 0),
        },
      );
      if (reason) {
        message = reason;
        break;
      }
      next.push({ key: crypto.randomUUID(), file, url: URL.createObjectURL(file) });
    }
    setError(message);
    onPending(next);
  }

  function dropPending(key: string) {
    const item = pending.find((entry) => entry.key === key);
    if (item) URL.revokeObjectURL(item.url);
    onPending(pending.filter((entry) => entry.key !== key));
  }

  return (
    <div className="grid gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-xs">Imágenes y videos</p>
        <p className="text-[11px] text-[#6b726c]">
          {kept.length + pending.length}/{pieceMedia.maxFiles}
        </p>
      </div>
      <p className="text-[11px] leading-5 text-[#6b726c]">
        Hasta {pieceMedia.maxFiles} archivos y {formatPieceBytes(pieceMedia.maxPieceBytes)} por pieza. Las fotos se
        achican al guardar, con un tope de {formatPieceBytes(pieceMedia.maxImageBytes)}. Los videos, de{" "}
        {formatPieceBytes(videoCap)}.
      </p>
      {kept.length || pending.length || removed.length ? (
        <div className="grid grid-cols-2 gap-2">
          {kept.map((file) => (
            <figure key={file.id} className="overflow-hidden rounded-xl border border-[#d5d8d1] bg-white/70">
              <MediaFrame url={file.url} type={file.contentType} name={file.filename || "Archivo"} />
              <figcaption className="flex items-center justify-between gap-2 px-2 py-1.5 text-[11px]">
                <span className="min-w-0 truncate">{file.filename || "Archivo"}</span>
                <button type="button" onClick={() => onRemoveExisting(file.id)} className="shrink-0 text-[#a45b5b]">
                  Quitar
                </button>
              </figcaption>
            </figure>
          ))}
          {pending.map((item) => (
            <figure key={item.key} className="overflow-hidden rounded-xl border border-[#c9d3c4] bg-white/70">
              <MediaFrame url={item.url} type={item.file.type} name={item.file.name} />
              <figcaption className="flex items-center justify-between gap-2 px-2 py-1.5 text-[11px]">
                <span className="min-w-0">
                  <span className="block truncate">{item.file.name}</span>
                  <span className="text-[#6b726c]">Vista previa · {formatPieceBytes(item.file.size)}</span>
                </span>
                <button type="button" onClick={() => dropPending(item.key)} className="shrink-0 text-[#a45b5b]">
                  Quitar
                </button>
              </figcaption>
            </figure>
          ))}
        </div>
      ) : null}
      {removed.length ? (
        <div className="flex flex-wrap gap-2">
          {removed.map((file) => (
            <button
              key={file.id}
              type="button"
              onClick={() => onRestoreExisting(file.id)}
              className="rounded-full border border-[#cfd4cc] px-3 py-1 text-[11px]"
            >
              Volver a poner {file.filename || "archivo"}
            </button>
          ))}
        </div>
      ) : null}
      <input
        type="file"
        multiple
        accept={pieceMediaAccept}
        onChange={(event) => {
          addFiles(event.target.files);
          event.target.value = "";
        }}
        className="block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-[#4f6f52] file:px-4 file:py-2 file:text-sm file:text-[#f7f5f0]"
      />
      {error ? <p className="text-sm text-[#a45b5b]">{error}</p> : null}
    </div>
  );
}

export async function storePieceFiles(pieceId: string, pending: PendingFile[], blobUploads: boolean) {
  for (const item of pending) {
    const prepared = item.file.type.startsWith("image/") ? await compressImageFile(item.file) : item.file;
    const reason = rejectionReason(
      { type: prepared.type || item.file.type, size: prepared.size },
      { blob: blobUploads, already: 0, alreadyBytes: 0 },
    );
    if (reason) throw new Error(reason);
    if (blobUploads) {
      const blob = await upload(`ops/piezas/${pieceId}/${prepared.name}`, prepared, {
        access: "public",
        handleUploadUrl: "/ops/archivos",
        contentType: prepared.type || item.file.type,
      });
      const saved = await addOpsPieceFileAction({
        pieceId,
        url: blob.url,
        filename: item.file.name,
        contentType: prepared.type || item.file.type,
        sizeBytes: prepared.size,
      });
      if ("error" in saved) throw new Error(saved.error);
    } else {
      const body = new FormData();
      body.set("pieceId", pieceId);
      body.set("file", prepared);
      const response = await fetch("/ops/archivos", { method: "POST", body });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error || "No se pudo subir el archivo.");
    }
    URL.revokeObjectURL(item.url);
  }
}

export async function dropPieceFiles(ids: string[]) {
  for (const id of ids) {
    const result = await removeOpsPieceFileAction(id);
    if ("error" in result) throw new Error(result.error);
  }
}
