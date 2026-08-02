import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { randomBytes } from "crypto";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_MIME_TYPES = new Set([
  // Images
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  // PDFs
  "application/pdf",
  // Docs
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // Spreadsheets
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  // Text
  "text/plain",
  "text/csv",
]);

const ALLOWED_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "svg",
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "txt",
  "csv",
]);

function getExtension(filename: string): string {
  const parts = filename.split(".");
  if (parts.length < 2) return "";
  return parts[parts.length - 1].toLowerCase();
}

export async function uploadFile(
  file: File
): Promise<{ url: string; filename: string }> {
  // Validate file type by MIME
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    // Also check extension as fallback
    const ext = getExtension(file.name);
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      throw new Error(
        `Type de fichier non autorisé. Types acceptés : images, PDF, documents Word/Excel, fichiers texte.`
      );
    }
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`Fichier trop volumineux. Taille maximale : 10 Mo.`);
  }

  // Ensure upload directory exists
  await mkdir(UPLOAD_DIR, { recursive: true });

  // Generate unique filename
  const ext = getExtension(file.name);
  const timestamp = Date.now().toString(36);
  const random = randomBytes(6).toString("hex");
  const uniqueName = `${timestamp}-${random}${ext ? `.${ext}` : ""}`;

  // Write file to disk
  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = join(UPLOAD_DIR, uniqueName);
  await writeFile(filePath, buffer);

  // Return public URL path
  const url = `/uploads/${uniqueName}`;

  return { url, filename: uniqueName };
}
