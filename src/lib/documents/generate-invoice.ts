import { createAuthProvider } from "@/lib/auth/create-auth-provider";
import { validateRequestAuthorization } from "@/lib/auth/validate-request";
import type { IAuthProvider } from "@/lib/auth/auth-provider.interface";
import type { IBackendClient } from "@/lib/backend/backend-client.interface";
import { createBackendClient } from "@/lib/backend/client";
import { AuthenticationError } from "@/lib/errors/document-errors";
import { convertBackendInvoiceToDocument } from "@/lib/backend/converters/invoice.converters";
import { renderInvoiceHtml } from "@/lib/invoice/render-invoice-html";
import { log } from "@/lib/logger";
import { generatePdf } from "@/lib/pdf/generate-pdf";
import { uploadDocument } from "./upload-document";

export interface IGenerateInvoiceInput {
  invoiceId: string;
  request: Request;
}

export interface IGenerateInvoiceResult {
  documentId: string;
}

export interface IGenerateInvoiceDependencies {
  authProvider: IAuthProvider;
  backendClient: IBackendClient;
}

function createDefaultDependencies(): IGenerateInvoiceDependencies {
  const backendClient = createBackendClient();

  return {
    backendClient,
    authProvider: createAuthProvider(backendClient),
  };
}

export async function generateInvoice(
  input: IGenerateInvoiceInput,
  dependencies: IGenerateInvoiceDependencies = createDefaultDependencies(),
): Promise<IGenerateInvoiceResult> {
  const requestId = crypto.randomUUID();
  const startedAt = Date.now();

  log({
    event: "request_started",
    requestId,
  });

  const authContext = await validateRequestAuthorization(
    input.request,
    dependencies.authProvider,
  );

  log({
    event: "authorization_result",
    requestId,
    isAuthorized: authContext.authorization.isAuthorized,
    authStatus: authContext.authorization.status,
  });

  if (!authContext.authorization.isAuthorized) {
    const httpStatus = authContext.authorization.status === "forbidden" ? 403 : 401;
    throw new AuthenticationError("Request is not authorized", httpStatus);
  }

  const invoiceFetchStartedAt = Date.now();
  const backendInvoice = await dependencies.backendClient.getInvoiceData({
    invoiceId: input.invoiceId,
    cookieHeader: authContext.cookieHeader,
  });
  const invoiceDataFetchDurationMs = Date.now() - invoiceFetchStartedAt;

  log({
    event: "invoice_data_fetched",
    requestId,
    invoiceDataFetchDurationMs,
  });

  const invoiceData = convertBackendInvoiceToDocument(backendInvoice);
  const html = renderInvoiceHtml(invoiceData);

  const pdfStartedAt = Date.now();
  const pdf = await generatePdf(html, requestId);
  const pdfGenerationDurationMs = Date.now() - pdfStartedAt;

  log({
    event: "pdf_generated",
    requestId,
    pdfGenerationDurationMs,
  });

  const uploadStartedAt = Date.now();
  const uploadResult = await uploadDocument(
    {
      file: pdf,
      filename: `invoice-${input.invoiceId}.pdf`,
      mimeType: "application/pdf",
      cookieHeader: authContext.cookieHeader,
      metadata: {
        invoiceId: input.invoiceId,
      },
    },
    dependencies.backendClient,
  );
  const uploadDurationMs = Date.now() - uploadStartedAt;

  log({
    event: "document_uploaded",
    requestId,
    uploadDurationMs,
    documentId: uploadResult.documentId,
  });

  log({
    event: "request_completed",
    requestId,
    documentId: uploadResult.documentId,
    invoiceDataFetchDurationMs,
    pdfGenerationDurationMs,
    uploadDurationMs,
    totalDurationMs: Date.now() - startedAt,
  });

  return {
    documentId: uploadResult.documentId,
  };
}
