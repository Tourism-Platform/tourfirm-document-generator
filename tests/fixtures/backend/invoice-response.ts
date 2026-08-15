import { createMockInvoiceBackendSource } from "@/lib/backend/mock-invoice-data";
import type { IBackendInvoiceSource } from "@/lib/backend/types";

export const backendInvoiceSourceFixture: IBackendInvoiceSource =
  createMockInvoiceBackendSource("example-id");
