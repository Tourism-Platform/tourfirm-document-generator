import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const OUTPUT_DIR = path.join(process.cwd(), "generated", "invoices");

export function getLocalPdfRelativePath(filename: string): string {
  return path.posix.join("generated", "invoices", filename);
}

export function toSafePdfFilename(invoiceId: string): string {
  const safeId = invoiceId.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `invoice-${safeId}.pdf`;
}

export async function savePdfLocal(
  filename: string,
  pdf: Buffer,
): Promise<string> {
  await mkdir(OUTPUT_DIR, { recursive: true });
  await writeFile(path.join(OUTPUT_DIR, filename), pdf);
  return getLocalPdfRelativePath(filename);
}
