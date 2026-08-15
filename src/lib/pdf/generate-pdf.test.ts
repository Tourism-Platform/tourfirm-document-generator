import { describe, expect, it } from "vitest";
import { invoiceDocumentDataFixture } from "../../../tests/fixtures/invoice/invoice-document-data";
import { renderInvoiceHtml } from "@/lib/invoice/render-invoice-html";
import { generatePdf } from "./generate-pdf";

describe("generatePdf", () => {
  it("returns an A4 PDF buffer from invoice HTML", async () => {
    const html = renderInvoiceHtml(invoiceDocumentDataFixture);
    const pdf = await generatePdf(html);

    expect(pdf.subarray(0, 4).toString()).toBe("%PDF");
    expect(pdf.byteLength).toBeGreaterThan(1000);
  });
});
