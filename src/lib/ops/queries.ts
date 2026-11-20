import { ensureOpsSchema } from "@/lib/ops/db";
import { defaultLabels, type LabelKind } from "@/lib/ops/labels";
import { acceptablePieceFileUrl, rejectionReason } from "@/lib/ops/piece-media";
import { discardStoredFile } from "@/lib/ops/piece-storage";

export type OpsClient = {
  id: string;
  slug: string;
  name: string;
};

export type OpsLabelRow = {
  id: string;
  kind: LabelKind;
  name: string;
  color: string;
  sort: number;
};

export type OpsPiece = {
  id: string;
  clientId: string;
  publishOn: string;
  timeLabel: string;
  account: string;
  format: string;
  pillar: string;
  status: string;
  theme: string;
  material: string;
  copy: string;
  brief: string;
  cta: string;
  owner: string;
  files: OpsPieceFile[];
};

export type OpsPieceFile = {
  id: string;
  url: string;
  filename: string;
  contentType: string;
  sizeBytes: number;
};

export type PieceInput = Omit<OpsPiece, "id" | "clientId" | "files">;

function asDate(value: unknown) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value ?? "").slice(0, 10);
}

function asPiece(row: Record<string, unknown>): OpsPiece {
  return {
    id: String(row.id),
    clientId: String(row.client_id),
    publishOn: asDate(row.publish_on),
    timeLabel: String(row.time_label ?? ""),
    account: String(row.account ?? ""),
    format: String(row.format ?? ""),
    pillar: String(row.pillar ?? ""),
    status: String(row.status ?? ""),
    theme: String(row.theme ?? ""),
    material: String(row.material ?? ""),
    copy: String(row.copy ?? ""),
    brief: String(row.brief ?? ""),
    cta: String(row.cta ?? ""),
    owner: String(row.owner ?? ""),
    files: [],
  };
}

function asFile(row: Record<string, unknown>): OpsPieceFile {
  return {
    id: String(row.id),
    url: String(row.url ?? ""),
    filename: String(row.filename ?? ""),
    contentType: String(row.content_type ?? ""),
    sizeBytes: Number(row.size_bytes ?? 0),
  };
}

async function attachFiles(pieces: OpsPiece[]) {
  if (!pieces.length) return pieces;
  const sql = await ensureOpsSchema();
  if (!sql) return pieces;
  const ids = pieces.map((piece) => piece.id);
  const rows = await sql`
    SELECT id, piece_id, url, filename, content_type, size_bytes
    FROM ops_piece_files
    WHERE piece_id::text = ANY(${ids})
    ORDER BY sort, created_at
  `;
  const byPiece = new Map<string, OpsPieceFile[]>();
  for (const row of rows) {
    const pieceId = String(row.piece_id);
    const list = byPiece.get(pieceId) ?? [];
    list.push(asFile(row as Record<string, unknown>));
    byPiece.set(pieceId, list);
  }
  return pieces.map((piece) => ({ ...piece, files: byPiece.get(piece.id) ?? [] }));
}

export async function listOpsClients() {
  const sql = await ensureOpsSchema();
  if (!sql) return [];
  const rows = await sql`SELECT id, slug, name FROM ops_clients ORDER BY name`;
  return rows.map((row) => ({
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
  })) as OpsClient[];
}

export async function getOpsClient(slug: string) {
  const clients = await listOpsClients();
  return clients.find((item) => item.slug === slug) ?? clients[0] ?? null;
}

function slugify(name: string) {
  const slug = name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return slug || "cliente";
}

export async function createOpsClient(name: string, account: string, destination: string) {
  const sql = await ensureOpsSchema();
  if (!sql) throw new Error("Falta DATABASE_URL de Neon.");
  const trimmed = name.trim();
  const accountRef = account.trim();
  const destinationRef = destination.trim();
  if (!trimmed) throw new Error("Falta el nombre del cliente.");
  if (!accountRef) throw new Error("Falta la cuenta.");
  if (!destinationRef) throw new Error("Falta el destino.");

  let slug = slugify(trimmed);
  const existing = await sql`SELECT slug FROM ops_clients WHERE slug = ${slug} OR slug LIKE ${`${slug}-%`}`;
  const taken = new Set(existing.map((row) => String(row.slug)));
  if (taken.has(slug)) {
    let index = 2;
    while (taken.has(`${slug}-${index}`)) index += 1;
    slug = `${slug}-${index}`;
  }

  const created = await sql`
    INSERT INTO ops_clients (slug, name) VALUES (${slug}, ${trimmed})
    RETURNING id, slug, name
  `;
  const clientId = String(created[0].id);
  await sql`
    INSERT INTO ops_plans (client_id, name, account_ref, destination)
    VALUES (${clientId}, ${"Pauta"}, ${accountRef}, ${destinationRef})
  `;
  const labels = [
    { kind: "account" as const, name: trimmed, color: "#4f6f52", sort: 0 },
    ...defaultLabels.filter((label) => label.kind !== "account"),
  ];
  for (const label of labels) {
    await sql`
      INSERT INTO ops_labels (client_id, kind, name, color, sort)
      VALUES (${clientId}, ${label.kind}, ${label.name}, ${label.color}, ${label.sort})
      ON CONFLICT (client_id, kind, name) DO NOTHING
    `;
  }

  return {
    id: clientId,
    slug: String(created[0].slug),
    name: String(created[0].name),
  } as OpsClient;
}

export async function listOpsLabels(clientId: string) {
  const sql = await ensureOpsSchema();
  if (!sql) return [];
  const rows = await sql`
    SELECT id, kind, name, color, sort
    FROM ops_labels
    WHERE client_id = ${clientId}
    ORDER BY kind, sort, name
  `;
  return rows.map((row) => ({
    id: String(row.id),
    kind: row.kind as LabelKind,
    name: String(row.name),
    color: String(row.color),
    sort: Number(row.sort ?? 0),
  })) as OpsLabelRow[];
}

export async function listOpsPieces(clientId: string, from: string, to: string) {
  const sql = await ensureOpsSchema();
  if (!sql) return [];
  const rows = await sql`
    SELECT *
    FROM ops_pieces
    WHERE client_id = ${clientId}
      AND publish_on >= ${from}::date
      AND publish_on <= ${to}::date
    ORDER BY publish_on, sort, created_at
  `;
  return attachFiles(rows.map((row) => asPiece(row as Record<string, unknown>)));
}

export async function getOpsPiece(id: string) {
  const sql = await ensureOpsSchema();
  if (!sql) return null;
  const rows = await sql`SELECT * FROM ops_pieces WHERE id = ${id} LIMIT 1`;
  if (!rows[0]) return null;
  const [piece] = await attachFiles([asPiece(rows[0] as Record<string, unknown>)]);
  return piece;
}

export async function createOpsPiece(clientId: string, input: PieceInput) {
  const sql = await ensureOpsSchema();
  if (!sql) throw new Error("Falta DATABASE_URL de Neon.");
  const rows = await sql`
    INSERT INTO ops_pieces (
      client_id, publish_on, time_label, account, format, pillar, status,
      theme, material, copy, brief, cta, owner
    ) VALUES (
      ${clientId}, ${input.publishOn}::date, ${input.timeLabel}, ${input.account},
      ${input.format}, ${input.pillar}, ${input.status}, ${input.theme},
      ${input.material}, ${input.copy}, ${input.brief}, ${input.cta}, ${input.owner}
    )
    RETURNING *
  `;
  return asPiece(rows[0] as Record<string, unknown>);
}

export async function updateOpsPiece(id: string, input: PieceInput) {
  const sql = await ensureOpsSchema();
  if (!sql) throw new Error("Falta DATABASE_URL de Neon.");
  const rows = await sql`
    UPDATE ops_pieces SET
      publish_on = ${input.publishOn}::date,
      time_label = ${input.timeLabel},
      account = ${input.account},
      format = ${input.format},
      pillar = ${input.pillar},
      status = ${input.status},
      theme = ${input.theme},
      material = ${input.material},
      copy = ${input.copy},
      brief = ${input.brief},
      cta = ${input.cta},
      owner = ${input.owner},
      updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `;
  if (!rows[0]) throw new Error("No se encontró la pieza.");
  return asPiece(rows[0] as Record<string, unknown>);
}

export async function deleteOpsPiece(id: string) {
  const sql = await ensureOpsSchema();
  if (!sql) throw new Error("Falta DATABASE_URL de Neon.");
  const files = await sql`SELECT url FROM ops_piece_files WHERE piece_id = ${id}`;
  await sql`DELETE FROM ops_pieces WHERE id = ${id}`;
  for (const row of files) await discardStoredFile(String(row.url ?? ""));
}

export async function addOpsPieceFile(input: {
  pieceId: string;
  url: string;
  filename: string;
  contentType: string;
  sizeBytes: number;
}) {
  const sql = await ensureOpsSchema();
  if (!sql) throw new Error("Falta DATABASE_URL de Neon.");
  if (!acceptablePieceFileUrl(input.url)) throw new Error("El archivo quedó en un lugar que no podemos guardar.");
  const piece = await sql`SELECT id FROM ops_pieces WHERE id = ${input.pieceId} LIMIT 1`;
  if (!piece[0]) throw new Error("No se encontró la pieza.");
  const existing = await sql`
    SELECT count(*)::int AS n, coalesce(sum(size_bytes), 0)::int AS bytes
    FROM ops_piece_files
    WHERE piece_id = ${input.pieceId}
  `;
  const already = Number(existing[0]?.n ?? 0);
  const alreadyBytes = Number(existing[0]?.bytes ?? 0);
  const storedOnBlob = input.url.startsWith("https://");
  const reason = rejectionReason(
    { type: input.contentType, size: input.sizeBytes },
    { blob: storedOnBlob, already, alreadyBytes },
  );
  if (reason) throw new Error(reason);
  const rows = await sql`
    INSERT INTO ops_piece_files (piece_id, url, filename, content_type, size_bytes, sort)
    VALUES (
      ${input.pieceId},
      ${input.url},
      ${input.filename.slice(0, 180)},
      ${input.contentType},
      ${Math.round(input.sizeBytes)},
      ${already}
    )
    RETURNING id, url, filename, content_type, size_bytes
  `;
  return asFile(rows[0] as Record<string, unknown>);
}

export async function removeOpsPieceFile(id: string) {
  const sql = await ensureOpsSchema();
  if (!sql) throw new Error("Falta DATABASE_URL de Neon.");
  const rows = await sql`SELECT url FROM ops_piece_files WHERE id = ${id} LIMIT 1`;
  if (!rows[0]) return;
  const url = String(rows[0].url ?? "");
  await sql`DELETE FROM ops_piece_files WHERE id = ${id}`;
  await discardStoredFile(url);
}
