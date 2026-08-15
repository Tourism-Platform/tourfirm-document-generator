import { describe, expect, it } from "vitest";
import { MockAuthProvider } from "@/lib/auth/auth-provider.mock";
import { MockBackendClient } from "@/lib/backend/backend-client.mock";
import { AuthenticationError, InvoiceDataError } from "@/lib/errors/document-errors";
import { generateInvoice } from "./generate-invoice";

function createRequest(cookie?: string): Request {
  const headers = new Headers({
    "content-type": "application/json",
  });

  if (cookie) {
    headers.set("cookie", cookie);
  }

  return new Request("http://localhost/api/documents/invoice", {
    method: "POST",
    headers,
    body: JSON.stringify({ invoiceId: "example-id" }),
  });
}

describe("generateInvoice", () => {
  const dependencies = {
    authProvider: new MockAuthProvider(),
    backendClient: new MockBackendClient(),
  };

  it("rejects unauthorized requests", async () => {
    await expect(
      generateInvoice({ invoiceId: "example-id", request: createRequest() }, dependencies),
    ).rejects.toBeInstanceOf(AuthenticationError);
  });

  it("generates a document through the complete mock pipeline", async () => {
    const result = await generateInvoice(
      { invoiceId: "example-id", request: createRequest("session=test") },
      dependencies,
    );

    expect(result.documentId).toBe("mock-document-id");
  });

  it("throws InvoiceDataError when the invoice is missing", async () => {
    await expect(
      generateInvoice(
        { invoiceId: "not-found", request: createRequest("session=test") },
        dependencies,
      ),
    ).rejects.toBeInstanceOf(InvoiceDataError);
  });
});
