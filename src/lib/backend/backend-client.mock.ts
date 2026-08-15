import type { IAuthorizeInput } from "@/lib/auth/auth-provider.interface";
import { AuthenticationError, DocumentUploadError } from "@/lib/errors/document-errors";
import { backendAuthResponseSchema } from "@/lib/backend/schema/auth-backend.schema";
import { backendDocumentUploadResponseSchema } from "@/lib/backend/schema/document-upload-backend.schema";
import { backendInvoiceSourceSchema } from "@/lib/backend/schema/invoice-source-backend.schema";
import type {
  IBackendAuthResponse,
  IBackendDocumentUploadResponse,
  IBackendInvoiceSource,
} from "@/lib/backend/types";
import type {
  IBackendClient,
  IGetInvoiceDataInput,
  IUploadDocumentInput,
} from "./backend-client.interface";
import {
  assertMockInvoiceExists,
  createMockInvoiceBackendSource,
} from "./mock-invoice-data";

export class MockBackendClient implements IBackendClient {
  async authorize(input: IAuthorizeInput): Promise<IBackendAuthResponse> {
    const cookieHeader = input.cookieHeader?.trim() ?? "";

    if (!cookieHeader) {
      throw new AuthenticationError("Request is not authorized", 401);
    }

    if (cookieHeader === "forbidden") {
      throw new AuthenticationError("Request is not authorized", 403);
    }

    return backendAuthResponseSchema.parse({
      id: "user-example-id",
      email: "operator@example.com",
      role: "operator",
      picture: null,
      agency_id: null,
      operator_id: "operator-example-id",
    });
  }

  async getInvoiceData(input: IGetInvoiceDataInput): Promise<IBackendInvoiceSource> {
    void input.cookieHeader;
    assertMockInvoiceExists(input.invoiceId);
    return backendInvoiceSourceSchema.parse(
      createMockInvoiceBackendSource(input.invoiceId),
    );
  }

  async uploadDocument(
    input: IUploadDocumentInput,
  ): Promise<IBackendDocumentUploadResponse> {
    if (input.file.byteLength === 0) {
      throw new DocumentUploadError("Cannot upload an empty document");
    }

    const source = createMockInvoiceBackendSource(input.metadata.invoiceId);

    return backendDocumentUploadResponseSchema.parse({
      ...source.invoice,
      id: "mock-document-id",
    });
  }
}
