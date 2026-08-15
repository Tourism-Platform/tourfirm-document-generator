import { describe, expect, it, vi } from "vitest";
import { InvoiceDataError } from "@/lib/errors/document-errors";
import { generateInvoiceMock, resolveMockInvoiceId } from "./generate-invoice-mock";

describe("resolveMockInvoiceId", () => {
  it("falls back to example-id when the value is empty", () => {
    expect(resolveMockInvoiceId()).toBe("example-id");
    expect(resolveMockInvoiceId("")).toBe("example-id");
    expect(resolveMockInvoiceId("  ")).toBe("example-id");
  });
});

describe("generateInvoiceMock", () => {
  it("renders mock backend DTO and saves a local PDF", async () => {
    const pdf = Buffer.from("%PDF-mock");
    const generatePdf = vi.fn().mockResolvedValue(pdf);
    const savePdfLocal = vi
      .fn()
      .mockResolvedValue("generated/invoices/invoice-example-id.pdf");

    const result = await generateInvoiceMock(
      {},
      { generatePdf, savePdfLocal },
    );

    expect(result).toEqual({
      documentId: "invoice-example-id.pdf",
      path: "generated/invoices/invoice-example-id.pdf",
    });
    expect(generatePdf).toHaveBeenCalledOnce();
    expect(String(generatePdf.mock.calls[0]?.[0])).toContain("INV-2026-00142");
    expect(String(generatePdf.mock.calls[0]?.[0])).toContain("Exo 2");
    expect(String(generatePdf.mock.calls[0]?.[0])).toContain("#36bffa");
    expect(savePdfLocal).toHaveBeenCalledWith("invoice-example-id.pdf", pdf);
  });

  it("throws InvoiceDataError when the invoice is missing", async () => {
    await expect(
      generateInvoiceMock(
        { invoiceId: "not-found" },
        { generatePdf: vi.fn(), savePdfLocal: vi.fn() },
      ),
    ).rejects.toBeInstanceOf(InvoiceDataError);
  });
});
