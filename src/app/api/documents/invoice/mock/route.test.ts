import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/documents/generate-invoice-mock", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/lib/documents/generate-invoice-mock")>();

  return {
    ...actual,
    generateInvoiceMock: vi.fn(),
  };
});

import { generateInvoiceMock } from "@/lib/documents/generate-invoice-mock";
import { OPTIONS, POST } from "./route";

const generateInvoiceMockMock = vi.mocked(generateInvoiceMock);

function createPostRequest(body?: unknown): Request {
  const headers = new Headers({
    "content-type": "application/json",
  });

  return new Request("http://localhost/api/documents/invoice/mock", {
    method: "POST",
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

describe("POST /api/documents/invoice/mock", () => {
  beforeEach(() => {
    generateInvoiceMockMock.mockReset();
    generateInvoiceMockMock.mockResolvedValue({
      documentId: "invoice-example-id.pdf",
      path: "generated/invoices/invoice-example-id.pdf",
    });
  });

  it("returns 204 for a CORS preflight", async () => {
    const response = await OPTIONS(
      new Request("http://localhost/api/documents/invoice/mock", {
        method: "OPTIONS",
      }),
    );

    expect(response.status).toBe(204);
  });

  it("returns a local PDF path without a request body", async () => {
    const response = await POST(createPostRequest());
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      documentId: "invoice-example-id.pdf",
      path: "generated/invoices/invoice-example-id.pdf",
    });
    expect(generateInvoiceMockMock).toHaveBeenCalledWith({
      invoiceId: undefined,
    });
  });

  it("returns 404 when the mock invoice is missing", async () => {
    const { InvoiceDataError } = await import("@/lib/errors/document-errors");
    generateInvoiceMockMock.mockRejectedValue(
      new InvoiceDataError("Invoice was not found", 404),
    );

    const response = await POST(createPostRequest({ invoiceId: "not-found" }));

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({ error: "Invoice not found" });
  });
});
