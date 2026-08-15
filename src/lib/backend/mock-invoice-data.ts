import { InvoiceDataError } from "@/lib/errors/document-errors";
import type { IBackendInvoiceSource } from "@/lib/backend/types";

export function createMockInvoiceBackendSource(
  invoiceId: string,
): IBackendInvoiceSource {
  return {
    invoice: {
      id: invoiceId,
      invoice_number: "INV-2026-00142",
      booking_id: "booking-example-id",
      order_number: "ORD-10042",
      typ: "tour",
      status: "paid",
      amount: "670.00",
      currency: "USD",
      total: "670.00",
      paid_amount: "500.00",
      balance: "170.00",
      issued_at: "2024-10-10T10:00:00Z",
      payment_details: {
        typ: "classic_swift",
        account_name_iban: "PT50 0000 0000 0000 0000 0000 0",
        swift_bic: "BBPIPTPL",
        bank_name: "Millennium BCP",
        bank_address: "Lisbon, Portugal",
      },
    },
    operator: {
      id: "operator-example-id",
      name: "OrientStar",
      business_name: "ASIANTICA",
      legal_name: "OrientStar",
      contact_person: "Alex Rivera",
      contact_email: "hello@orientstar.example",
      contact_phone: "+351 21 555 0199",
      tax_id: "PT-501234567",
      address_line: "Rua Augusta 120",
      city: "Lisbon",
      country: "Portugal",
    },
    booking: {
      order: {
        id: "booking-example-id",
        order_number: "ORD-10042",
        date: "2024-10-15",
        end_date: "2024-10-20",
        pax: 12,
        status: "confirmed",
        comment: "Please arrange early check-in if possible.",
      },
      tour: {
        title: "Uzbekistan group tour",
        typ: "group",
        days: 5,
        nights: 4,
        route: ["Tashkent", "Samarkand", "Bukhara"],
      },
      agency: {
        id: "agency-example-id",
        name: "Global travel agency",
        business_name: "Global travel agency",
        legal_name: "Global travel agency",
        contact_person: "Jo Malou",
        contact_email: "jo.malou@globaltravel.example",
        contact_phone: "+1 212 555 0147",
        tax_id: "US-98-7654321",
        address_line: "Strange st. 98",
        city: "New York, NY 10004",
        country: "United States",
      },
      user: null,
    },
    itinerary: {
      booking_id: "booking-example-id",
      order_number: "ORD-10042",
      display_lang: "en",
      events: [
        {
          name: "Flight Tashkent — Samarkand",
          typ: "flight",
          day: 1,
          position: 1,
          cost: 180,
          markup: 20,
          fees: 0,
        },
        {
          name: "Hotel Hilton Tashkent",
          typ: "housing",
          day: 1,
          position: 2,
          cost: 320,
          markup: 30,
          fees: 10,
        },
        {
          name: "Meals",
          typ: "supplementary",
          day: 2,
          position: 1,
          cost: 0,
          markup: 0,
          fees: 0,
          details: [
            { name: "Breakfast", typ: "activity" },
            { name: "Lunch", typ: "activity" },
            { name: "Dinner", typ: "activity" },
          ],
        },
        {
          name: "Airport transfer",
          typ: "transfer",
          day: 5,
          position: 1,
          cost: 90,
          markup: 20,
          fees: 0,
        },
      ],
    },
  };
}

export function assertMockInvoiceExists(invoiceId: string): void {
  if (invoiceId === "not-found") {
    throw new InvoiceDataError("Invoice was not found", 404);
  }
}
