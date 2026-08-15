import { describe, expect, it } from "vitest";
import { invoiceDocumentDataSchema } from "./invoice.schema";
import { invoiceDocumentDataFixture } from "../../tests/fixtures/invoice/invoice-document-data";

describe("invoiceDocumentDataSchema", () => {
  it("accepts normalized invoice document data", () => {
    const result = invoiceDocumentDataSchema.safeParse(invoiceDocumentDataFixture);

    expect(result.success).toBe(true);
  });

  it("rejects invoice data without items", () => {
    const result = invoiceDocumentDataSchema.safeParse({
      ...invoiceDocumentDataFixture,
      items: [],
    });

    expect(result.success).toBe(false);
  });
});
