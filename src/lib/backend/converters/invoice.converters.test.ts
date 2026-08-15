import { describe, expect, it } from "vitest";
import { convertBackendInvoiceToDocument } from "./invoice.converters";
import { backendInvoiceSourceFixture } from "../../../../tests/fixtures/backend/invoice-response";
import { invoiceDocumentDataFixture } from "../../../../tests/fixtures/invoice/invoice-document-data";
import { InvoiceDataError } from "@/lib/errors/document-errors";
import type { IBackendInvoiceSource } from "@/lib/backend/types";

describe("convertBackendInvoiceToDocument", () => {
  it("maps a valid backend source to the internal document DTO", () => {
    const mapped = convertBackendInvoiceToDocument(backendInvoiceSourceFixture);

    expect(mapped).toEqual(invoiceDocumentDataFixture);
  });

  it("uses safe defaults when booking, itinerary and operator are missing", () => {
    const source: IBackendInvoiceSource = {
      ...backendInvoiceSourceFixture,
      booking: null,
      itinerary: null,
      operator: null,
    };

    const mapped = convertBackendInvoiceToDocument(source);

    expect(mapped.brand).toEqual({ name: "Invoice" });
    expect(mapped.seller).toEqual({
      name: "-",
      addressLines: ["-"],
    });
    expect(mapped.customer).toEqual({
      name: "-",
      addressLines: ["-"],
    });
    expect(mapped.booking).toBeUndefined();
    expect(mapped.items).toEqual([
      {
        description: "-",
        quantity: 1,
        unitPrice: 0,
        amount: 0,
      },
    ]);
    expect(mapped.document.number).toBe("INV-2026-00142");
    expect(mapped.totals.paid).toBe(500);
    expect(mapped.totals.remaining).toBe(170);
  });

  it("keeps nested itinerary details as item children", () => {
    const source: IBackendInvoiceSource = {
      ...backendInvoiceSourceFixture,
      itinerary: {
        booking_id: "booking-example-id",
        order_number: "ORD-10042",
        events: [
          {
            name: "Hotel options",
            typ: "options",
            details: [
              { name: "Hilton Lisbon", typ: "housing" },
              { name: "Pestana Palace", typ: "housing" },
            ],
          },
        ],
      },
    };

    const mapped = convertBackendInvoiceToDocument(source);

    expect(mapped.items).toEqual([
      {
        description: "Hotel options",
        typ: "options",
        quantity: 1,
        unitPrice: 0,
        amount: 0,
        children: [
          { description: "Hilton Lisbon", typ: "housing" },
          { description: "Pestana Palace", typ: "housing" },
        ],
      },
    ]);
  });

  it("parses money strings and ISO dates", () => {
    const source: IBackendInvoiceSource = {
      ...backendInvoiceSourceFixture,
      invoice: {
        ...backendInvoiceSourceFixture.invoice,
        amount: "+1195.00",
        total: "1,248.50".replace(",", ""),
        paid_amount: 0,
        issued_at: "2026-08-01T10:00:00Z",
      },
    };

    const mapped = convertBackendInvoiceToDocument(source);

    expect(mapped.totals.subtotal).toBe(1195);
    expect(mapped.totals.total).toBe(1248.5);
    expect(mapped.totals.paid).toBe(0);
    expect(mapped.document.issuedAt).toBe("2026-08-01");
  });

  it("treats null issued_at as a missing document date", () => {
    const source: IBackendInvoiceSource = {
      ...backendInvoiceSourceFixture,
      invoice: {
        ...backendInvoiceSourceFixture.invoice,
        issued_at: null,
      },
    };

    const mapped = convertBackendInvoiceToDocument(source);

    expect(mapped.document.issuedAt).toBe("-");
  });

  it("throws InvoiceDataError when domain validation fails", () => {
    const source: IBackendInvoiceSource = {
      ...backendInvoiceSourceFixture,
      invoice: {
        ...backendInvoiceSourceFixture.invoice,
        invoice_number: "",
      },
    };

    expect(() => convertBackendInvoiceToDocument(source)).toThrow(InvoiceDataError);
  });
});
