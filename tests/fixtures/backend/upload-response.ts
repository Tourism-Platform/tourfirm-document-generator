import { createMockInvoiceBackendSource } from "@/lib/backend/mock-invoice-data";
import type { IBackendDocumentUploadResponse } from "@/lib/backend/types";

export const backendUploadResponseFixture: IBackendDocumentUploadResponse = {
  ...createMockInvoiceBackendSource("example-id").invoice,
  id: "mock-document-id",
};
