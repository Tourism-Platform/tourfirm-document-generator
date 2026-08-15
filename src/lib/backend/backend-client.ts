import { getConfig, type IAppConfig } from "@/lib/config";
import type { IAuthorizeInput } from "@/lib/auth/auth-provider.interface";
import { mapOperatorItineraryToBackend } from "@/lib/backend/converters/operator-itinerary.converters";
import {
  AuthenticationError,
  BackendRequestError,
  DocumentUploadError,
  InvoiceDataError,
} from "@/lib/errors/document-errors";
import { backendAuthResponseSchema } from "@/lib/backend/schema/auth-backend.schema";
import { backendBookingResponseSchema, backendOperatorInfoSchema } from "@/lib/backend/schema/booking-backend.schema";
import { backendDocumentUploadResponseSchema } from "@/lib/backend/schema/document-upload-backend.schema";
import { backendInvoiceResponseSchema } from "@/lib/backend/schema/invoice-backend.schema";
import { backendItineraryResponseSchema } from "@/lib/backend/schema/itinerary-backend.schema";
import { backendInvoiceSourceSchema } from "@/lib/backend/schema/invoice-source-backend.schema";
import type {
  IBackendAuthResponse,
  IBackendBookingResponse,
  IBackendDocumentUploadResponse,
  IBackendInvoiceResponse,
  IBackendInvoiceSource,
  IBackendItineraryResponse,
} from "@/lib/backend/types";
import type {
  IBackendClient,
  IGetInvoiceDataInput,
  IUploadDocumentInput,
} from "./backend-client.interface";

type TFetchLike = (
  input: string,
  init?: { method?: string; headers?: Record<string, string>; body?: BodyInit },
) => Promise<Response>;

export interface IBackendClientDependencies {
  fetchImpl?: TFetchLike;
  getConfig?: () => IAppConfig;
}

export class BackendClient implements IBackendClient {
  constructor(private readonly dependencies: IBackendClientDependencies = {}) {}

  async authorize(input: IAuthorizeInput): Promise<IBackendAuthResponse> {
    const { status, data } = await this.fetchJson("/auth/me", input.cookieHeader);

    if (status === 401 || status === 403) {
      throw new AuthenticationError("Request is not authorized", status);
    }

    if (status < 200 || status >= 300) {
      throw new BackendRequestError("Backend authorization request failed");
    }

    const parsed = backendAuthResponseSchema.safeParse(data);

    if (!parsed.success) {
      throw new BackendRequestError("Backend authorization request failed");
    }

    return parsed.data;
  }

  async getInvoiceData(input: IGetInvoiceDataInput): Promise<IBackendInvoiceSource> {
    const invoice = await this.fetchInvoice(input.invoiceId, input.cookieHeader);
    const bookingId = invoice.booking_id?.trim() || null;

    const [booking, itinerary, operator] = await Promise.all([
      bookingId
        ? this.fetchBooking(bookingId, input.cookieHeader)
        : Promise.resolve(null),
      bookingId
        ? this.fetchItinerary(bookingId, input.cookieHeader)
        : Promise.resolve(null),
      this.fetchOperator(input.cookieHeader),
    ]);

    const parsed = backendInvoiceSourceSchema.safeParse({
      invoice,
      booking,
      itinerary,
      operator,
    });

    if (!parsed.success) {
      throw new InvoiceDataError("Invoice data could not be normalized", 422);
    }

    return parsed.data;
  }

  async uploadDocument(input: IUploadDocumentInput): Promise<IBackendDocumentUploadResponse> {
    if (input.file.byteLength === 0) {
      throw new DocumentUploadError("Cannot upload an empty document");
    }

    const fetchFn = this.dependencies.fetchImpl ?? fetch;
    const formData = new FormData();
    const bytes = new Uint8Array(input.file.byteLength);
    bytes.set(input.file);
    const file = new Blob([bytes], { type: input.mimeType });
    formData.append("file", file, input.filename);

    const headers: Record<string, string> = {
      Accept: "application/json",
    };

    if (input.cookieHeader) {
      headers.Cookie = input.cookieHeader;
    }

    let response: Response;

    try {
      response = await fetchFn(
        `${this.resolveBackendUrl()}/invoice/${encodeURIComponent(input.metadata.invoiceId)}/pdf`,
        {
          method: "POST",
          headers,
          body: formData,
        },
      );
    } catch (error) {
      if (error instanceof AuthenticationError || error instanceof BackendRequestError) {
        throw error;
      }

      throw new DocumentUploadError("Backend document upload request failed");
    }

    if (response.status === 401 || response.status === 403) {
      throw new AuthenticationError("Request is not authorized", response.status);
    }

    if (response.status < 200 || response.status >= 300) {
      throw new DocumentUploadError("Backend document upload request failed");
    }

    let data: unknown = null;

    try {
      data = await response.json();
    } catch {
      throw new DocumentUploadError("Backend document upload request failed");
    }

    const parsed = backendDocumentUploadResponseSchema.safeParse(data);

    if (!parsed.success) {
      throw new DocumentUploadError("Backend document upload request failed");
    }

    return parsed.data;
  }

  private resolveBackendUrl(): string {
    const config = (this.dependencies.getConfig ?? getConfig)();
    const backendUrl = config.backendUrl?.trim() ?? "";

    if (!backendUrl) {
      throw new BackendRequestError("Backend URL is not configured");
    }

    return backendUrl.replace(/\/$/, "");
  }

  private async fetchJson(
    path: string,
    cookieHeader: string | null,
  ): Promise<{ status: number; data: unknown }> {
    const fetchFn = this.dependencies.fetchImpl ?? fetch;
    const headers: Record<string, string> = {
      Accept: "application/json",
    };

    if (cookieHeader) {
      headers.Cookie = cookieHeader;
    }

    let response: Response;

    try {
      response = await fetchFn(`${this.resolveBackendUrl()}${path}`, {
        method: "GET",
        headers,
      });
    } catch {
      throw new BackendRequestError("Backend invoice data request failed");
    }

    let data: unknown = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    return {
      status: response.status,
      data,
    };
  }

  private async fetchInvoice(
    invoiceId: string,
    cookieHeader: string | null,
  ): Promise<IBackendInvoiceResponse> {
    const { status, data } = await this.fetchJson(
      `/invoice/${encodeURIComponent(invoiceId)}`,
      cookieHeader,
    );

    if (status === 401 || status === 403) {
      throw new AuthenticationError("Request is not authorized", status);
    }

    if (status === 404) {
      throw new InvoiceDataError("Invoice was not found", 404);
    }

    if (status < 200 || status >= 300) {
      throw new BackendRequestError("Backend invoice data request failed");
    }

    const parsed = backendInvoiceResponseSchema.safeParse(data);

    if (!parsed.success) {
      throw new InvoiceDataError("Invoice data could not be normalized", 422);
    }

    return parsed.data;
  }

  private async fetchBooking(
    bookingId: string,
    cookieHeader: string | null,
  ): Promise<IBackendBookingResponse | null> {
    const { status, data } = await this.fetchJson(
      `/booking/order/operator/${encodeURIComponent(bookingId)}`,
      cookieHeader,
    );

    if (status === 401 || status === 403) {
      throw new AuthenticationError("Request is not authorized", status);
    }

    if (status === 404 || status < 200 || status >= 300) {
      return null;
    }

    const parsed = backendBookingResponseSchema.safeParse(data);
    return parsed.success ? parsed.data : null;
  }

  private async fetchItinerary(
    bookingId: string,
    cookieHeader: string | null,
  ): Promise<IBackendItineraryResponse | null> {
    const { status, data } = await this.fetchJson(
      `/booking/order/operator/${encodeURIComponent(bookingId)}/itinerary`,
      cookieHeader,
    );

    if (status === 401 || status === 403) {
      throw new AuthenticationError("Request is not authorized", status);
    }

    if (status === 404 || status < 200 || status >= 300) {
      return null;
    }

    const mapped = mapOperatorItineraryToBackend(data);
    const parsed = backendItineraryResponseSchema.safeParse(mapped ?? data);
    return parsed.success ? parsed.data : null;
  }

  private async fetchOperator(
    cookieHeader: string | null,
  ): Promise<IBackendInvoiceSource["operator"]> {
    try {
      const { status, data } = await this.fetchJson("/operator/me/info", cookieHeader);

      if (status < 200 || status >= 300) {
        return null;
      }

      const parsed = backendOperatorInfoSchema.safeParse(data);
      return parsed.success ? parsed.data : null;
    } catch {
      return null;
    }
  }
}
