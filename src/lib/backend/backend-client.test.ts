import { describe, expect, it, vi } from "vitest";
import { BackendClient } from "./backend-client";
import { createMockInvoiceBackendSource } from "./mock-invoice-data";
import { backendAuthResponseFixture } from "../../../tests/fixtures/backend/auth-response";
import { backendUploadResponseFixture } from "../../../tests/fixtures/backend/upload-response";
import {
  AuthenticationError,
  BackendRequestError,
  DocumentUploadError,
  InvoiceDataError,
} from "@/lib/errors/document-errors";

function jsonResponse(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

describe("BackendClient.getInvoiceData", () => {
  const source = createMockInvoiceBackendSource("invoice-1");
  const config = {
    useMockBackend: false,
    backendUrl: "https://api.example.test",
    documentServiceSecret: undefined,
    isVercel: false,
  };

  it("loads invoice, booking, itinerary and operator by booking_id", async () => {
    const fetchImpl = vi.fn(async (url: string) => {
      if (url.endsWith("/invoice/invoice-1")) {
        return jsonResponse(200, source.invoice);
      }

      if (url.endsWith("/booking/order/operator/booking-example-id")) {
        return jsonResponse(200, source.booking);
      }

      if (url.endsWith("/booking/order/operator/booking-example-id/itinerary")) {
        return jsonResponse(200, source.itinerary);
      }

      if (url.endsWith("/operator/me/info")) {
        return jsonResponse(200, source.operator);
      }

      return jsonResponse(404, { detail: "not found" });
    });

    const client = new BackendClient({ fetchImpl, getConfig: () => config });
    const result = await client.getInvoiceData({
      invoiceId: "invoice-1",
      cookieHeader: "session=test",
    });

    expect(result.invoice.invoice_number).toBe("INV-2026-00142");
    expect(result.booking?.order.order_number).toBe("ORD-10042");
    expect(result.itinerary?.events).toHaveLength(4);
    expect(result.operator?.business_name).toBe("ASIANTICA");
    expect(fetchImpl).toHaveBeenCalledTimes(4);
    expect(fetchImpl.mock.calls[0]?.[1]).toEqual({
      method: "GET",
      headers: {
        Accept: "application/json",
        Cookie: "session=test",
      },
    });
  });

  it("keeps the invoice when operator info fails", async () => {
    const fetchImpl = vi.fn(async (url: string) => {
      if (url.endsWith("/invoice/invoice-1")) {
        return jsonResponse(200, source.invoice);
      }

      if (url.includes("/booking/order/operator/")) {
        return jsonResponse(200, url.endsWith("/itinerary") ? source.itinerary : source.booking);
      }

      if (url.endsWith("/operator/me/info")) {
        return jsonResponse(500, { detail: "unavailable" });
      }

      return jsonResponse(404, {});
    });

    const client = new BackendClient({ fetchImpl, getConfig: () => config });
    const result = await client.getInvoiceData({
      invoiceId: "invoice-1",
      cookieHeader: "session=test",
    });

    expect(result.operator).toBeNull();
    expect(result.invoice.id).toBe("invoice-1");
  });

  it("throws InvoiceDataError when the invoice is missing", async () => {
    const fetchImpl = vi.fn(async () => jsonResponse(404, { detail: "not found" }));
    const client = new BackendClient({ fetchImpl, getConfig: () => config });

    await expect(
      client.getInvoiceData({ invoiceId: "missing", cookieHeader: "session=test" }),
    ).rejects.toBeInstanceOf(InvoiceDataError);
  });

  it("throws AuthenticationError when the invoice request is unauthorized", async () => {
    const fetchImpl = vi.fn(async () => jsonResponse(401, { detail: "unauthorized" }));
    const client = new BackendClient({ fetchImpl, getConfig: () => config });

    await expect(
      client.getInvoiceData({ invoiceId: "invoice-1", cookieHeader: null }),
    ).rejects.toBeInstanceOf(AuthenticationError);
  });

  it("throws BackendRequestError when BACKEND_URL is missing", async () => {
    const client = new BackendClient({
      fetchImpl: vi.fn(),
      getConfig: () => ({ ...config, backendUrl: undefined }),
    });

    await expect(
      client.getInvoiceData({ invoiceId: "invoice-1", cookieHeader: "session=test" }),
    ).rejects.toBeInstanceOf(BackendRequestError);
  });
});

const liveConfig = {
  useMockBackend: false,
  backendUrl: "https://api.example.test",
  documentServiceSecret: undefined,
  isVercel: false,
};

describe("BackendClient.authorize", () => {
  it("loads the current user from /auth/me", async () => {
    const fetchImpl = vi.fn(async () => jsonResponse(200, backendAuthResponseFixture));
    const client = new BackendClient({ fetchImpl, getConfig: () => liveConfig });

    const result = await client.authorize({ cookieHeader: "session=test" });

    expect(result).toEqual(backendAuthResponseFixture);
    expect(fetchImpl).toHaveBeenCalledWith("https://api.example.test/auth/me", {
      method: "GET",
      headers: {
        Accept: "application/json",
        Cookie: "session=test",
      },
    });
  });

  it("throws AuthenticationError on 401", async () => {
    const fetchImpl = vi.fn(async () => jsonResponse(401, { detail: "unauthorized" }));
    const client = new BackendClient({ fetchImpl, getConfig: () => liveConfig });

    await expect(client.authorize({ cookieHeader: "session=test" })).rejects.toBeInstanceOf(
      AuthenticationError,
    );
  });

  it("throws AuthenticationError on 403", async () => {
    const fetchImpl = vi.fn(async () => jsonResponse(403, { detail: "forbidden" }));
    const client = new BackendClient({ fetchImpl, getConfig: () => liveConfig });

    await expect(client.authorize({ cookieHeader: "session=test" })).rejects.toMatchObject({
      name: "AuthenticationError",
      httpStatus: 403,
    });
  });

  it("throws BackendRequestError when the payload is invalid", async () => {
    const fetchImpl = vi.fn(async () => jsonResponse(200, { unexpected: true }));
    const client = new BackendClient({ fetchImpl, getConfig: () => liveConfig });

    await expect(client.authorize({ cookieHeader: "session=test" })).rejects.toBeInstanceOf(
      BackendRequestError,
    );
  });

  it("throws BackendRequestError on network failure", async () => {
    const fetchImpl = vi.fn(async () => {
      throw new Error("offline");
    });
    const client = new BackendClient({ fetchImpl, getConfig: () => liveConfig });

    await expect(client.authorize({ cookieHeader: "session=test" })).rejects.toBeInstanceOf(
      BackendRequestError,
    );
  });

  it("throws BackendRequestError when BACKEND_URL is missing", async () => {
    const fetchImpl = vi.fn();
    const client = new BackendClient({
      fetchImpl,
      getConfig: () => ({ ...liveConfig, backendUrl: undefined }),
    });

    await expect(client.authorize({ cookieHeader: "session=test" })).rejects.toBeInstanceOf(
      BackendRequestError,
    );
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});

describe("BackendClient.uploadDocument", () => {
  const pdf = Buffer.from("%PDF-test");
  const uploadInput = {
    file: pdf,
    filename: "invoice-invoice-1.pdf",
    mimeType: "application/pdf",
    cookieHeader: "session=test",
    metadata: { invoiceId: "invoice-1" },
  };

  it("uploads the PDF as multipart file", async () => {
    const fetchImpl = vi.fn(async () => jsonResponse(200, backendUploadResponseFixture));
    const client = new BackendClient({ fetchImpl, getConfig: () => liveConfig });

    const result = await client.uploadDocument(uploadInput);

    expect(result.id).toBe("mock-document-id");
    expect(fetchImpl).toHaveBeenCalledOnce();
    expect(fetchImpl.mock.calls[0]?.[0]).toBe(
      "https://api.example.test/invoice/invoice-1/pdf",
    );

    const init = fetchImpl.mock.calls[0]?.[1];
    expect(init?.method).toBe("POST");
    expect(init?.headers).toEqual({
      Accept: "application/json",
      Cookie: "session=test",
    });
    expect(init?.headers).not.toHaveProperty("Content-Type");
    expect(init?.body).toBeInstanceOf(FormData);

    const file = (init?.body as FormData).get("file");
    expect(file).toBeInstanceOf(Blob);
    expect((file as Blob).type).toBe("application/pdf");
  });

  it("throws AuthenticationError on 401", async () => {
    const fetchImpl = vi.fn(async () => jsonResponse(401, { detail: "unauthorized" }));
    const client = new BackendClient({ fetchImpl, getConfig: () => liveConfig });

    await expect(client.uploadDocument(uploadInput)).rejects.toBeInstanceOf(AuthenticationError);
  });

  it("throws AuthenticationError on 403", async () => {
    const fetchImpl = vi.fn(async () => jsonResponse(403, { detail: "forbidden" }));
    const client = new BackendClient({ fetchImpl, getConfig: () => liveConfig });

    await expect(client.uploadDocument(uploadInput)).rejects.toMatchObject({
      name: "AuthenticationError",
      httpStatus: 403,
    });
  });

  it("throws DocumentUploadError on 404", async () => {
    const fetchImpl = vi.fn(async () => jsonResponse(404, { detail: "not found" }));
    const client = new BackendClient({ fetchImpl, getConfig: () => liveConfig });

    await expect(client.uploadDocument(uploadInput)).rejects.toBeInstanceOf(DocumentUploadError);
  });

  it("throws DocumentUploadError on 422", async () => {
    const fetchImpl = vi.fn(async () => jsonResponse(422, { detail: "invalid" }));
    const client = new BackendClient({ fetchImpl, getConfig: () => liveConfig });

    await expect(client.uploadDocument(uploadInput)).rejects.toBeInstanceOf(DocumentUploadError);
  });

  it("throws DocumentUploadError on network failure", async () => {
    const fetchImpl = vi.fn(async () => {
      throw new Error("offline");
    });
    const client = new BackendClient({ fetchImpl, getConfig: () => liveConfig });

    await expect(client.uploadDocument(uploadInput)).rejects.toBeInstanceOf(DocumentUploadError);
  });

  it("throws DocumentUploadError when the payload is invalid", async () => {
    const fetchImpl = vi.fn(async () => jsonResponse(200, { unexpected: true }));
    const client = new BackendClient({ fetchImpl, getConfig: () => liveConfig });

    await expect(client.uploadDocument(uploadInput)).rejects.toBeInstanceOf(DocumentUploadError);
  });

  it("rejects an empty PDF without calling the backend", async () => {
    const fetchImpl = vi.fn();
    const client = new BackendClient({ fetchImpl, getConfig: () => liveConfig });

    await expect(
      client.uploadDocument({ ...uploadInput, file: Buffer.alloc(0) }),
    ).rejects.toBeInstanceOf(DocumentUploadError);
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});
