import type { IAuthorizeInput } from "@/lib/auth/auth-provider.interface";
import type {
  IBackendAuthResponse,
  IBackendDocumentUploadResponse,
  IBackendInvoiceSource,
} from "@/lib/backend/types";

export interface IUploadDocumentInput {
  file: Buffer | Uint8Array;
  filename: string;
  mimeType: string;
  cookieHeader: string | null;
  metadata: {
    invoiceId: string;
  };
}

export interface IGetInvoiceDataInput {
  invoiceId: string;
  cookieHeader: string | null;
}

export interface IBackendClient {
  authorize(input: IAuthorizeInput): Promise<IBackendAuthResponse>;
  getInvoiceData(input: IGetInvoiceDataInput): Promise<IBackendInvoiceSource>;
  uploadDocument(input: IUploadDocumentInput): Promise<IBackendDocumentUploadResponse>;
}
