import { convertBackendInvoiceToDocument } from "@/lib/backend/converters/invoice.converters";
import {
  assertMockInvoiceExists,
  createMockInvoiceBackendSource,
} from "@/lib/backend/mock-invoice-data";
import { renderInvoiceHtml } from "@/lib/invoice/render-invoice-html";
import { log } from "@/lib/logger";
import { generatePdf } from "@/lib/pdf/generate-pdf";
import { savePdfLocal, toSafePdfFilename } from "./save-pdf-local";

export const DEFAULT_MOCK_INVOICE_ID = "example-id";

export interface IGenerateInvoiceMockInput {
  invoiceId?: string;
}

export interface IGenerateInvoiceMockResult {
  documentId: string;
  path: string;
}

export interface IGenerateInvoiceMockDependencies {
  generatePdf: (html: string) => Promise<Buffer>;
  savePdfLocal: (filename: string, pdf: Buffer) => Promise<string>;
}

function createDefaultDependencies(): IGenerateInvoiceMockDependencies {
  return {
    generatePdf,
    savePdfLocal,
  };
}

export function resolveMockInvoiceId(invoiceId?: string): string {
  const trimmed = invoiceId?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : DEFAULT_MOCK_INVOICE_ID;
}

export async function generateInvoiceMock(
  input: IGenerateInvoiceMockInput = {},
  dependencies: IGenerateInvoiceMockDependencies = createDefaultDependencies(),
): Promise<IGenerateInvoiceMockResult> {
  const requestId = crypto.randomUUID();
  const startedAt = Date.now();
  const invoiceId = resolveMockInvoiceId(input.invoiceId);

  log({
    event: "request_started",
    requestId,
  });

  assertMockInvoiceExists(invoiceId);

  const backendInvoice = createMockInvoiceBackendSource(invoiceId);
  const invoiceData = convertBackendInvoiceToDocument(backendInvoice);
  const html = renderInvoiceHtml(invoiceData);

  const pdfStartedAt = Date.now();
  const pdf = await dependencies.generatePdf(html);
  const pdfGenerationDurationMs = Date.now() - pdfStartedAt;

  log({
    event: "pdf_generated",
    requestId,
    pdfGenerationDurationMs,
  });

  const filename = toSafePdfFilename(invoiceId);
  const relativePath = await dependencies.savePdfLocal(filename, pdf);

  log({
    event: "request_completed",
    requestId,
    documentId: filename,
    pdfGenerationDurationMs,
    totalDurationMs: Date.now() - startedAt,
  });

  return {
    documentId: filename,
    path: relativePath,
  };
}
