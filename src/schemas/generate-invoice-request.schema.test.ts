import { describe, expect, it } from "vitest";
import { generateInvoiceRequestSchema } from "./generate-invoice-request.schema";

describe("generateInvoiceRequestSchema", () => {
  it("accepts a minimal valid body", () => {
    const result = generateInvoiceRequestSchema.safeParse({
      invoiceId: "example-id",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an empty body", () => {
    const result = generateInvoiceRequestSchema.safeParse({});

    expect(result.success).toBe(false);
  });

  it("rejects an empty invoiceId", () => {
    const result = generateInvoiceRequestSchema.safeParse({
      invoiceId: "",
    });

    expect(result.success).toBe(false);
  });
});
