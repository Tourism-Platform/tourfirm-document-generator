import { describe, expect, it } from "vitest";
import { backendInvoiceSourceSchema } from "./invoice-source-backend.schema";
import { backendInvoiceSourceFixture } from "../../../../tests/fixtures/backend/invoice-response";

describe("backendInvoiceSourceSchema", () => {
  it("accepts a real-shaped backend source", () => {
    const result = backendInvoiceSourceSchema.safeParse(backendInvoiceSourceFixture);

    expect(result.success).toBe(true);
  });

  it("rejects an unrelated payload", () => {
    const result = backendInvoiceSourceSchema.safeParse({ unexpected: true });

    expect(result.success).toBe(false);
  });
});
