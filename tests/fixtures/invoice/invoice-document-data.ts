import { DEFAULT_INVOICE_TERMS } from "@/lib/backend/converters/invoice.converters";
import type { IInvoiceDocumentData } from "@/types/invoice";

export const invoiceDocumentDataFixture: IInvoiceDocumentData = {
  document: {
    number: "INV-2026-00142",
    issuedAt: "2024-10-10",
    currency: "USD",
  },
  brand: {
    name: "ASIANTICA",
  },
  seller: {
    name: "OrientStar",
    addressLines: ["Rua Augusta 120", "Lisbon", "Portugal"],
    contact: "Alex Rivera",
    email: "hello@orientstar.example",
    phone: "+351 21 555 0199",
    taxId: "PT-501234567",
  },
  customer: {
    name: "Global travel agency",
    addressLines: ["Strange st. 98", "New York, NY 10004", "United States"],
    contact: "Jo Malou",
    email: "jo.malou@globaltravel.example",
    phone: "+1 212 555 0147",
    taxId: "US-98-7654321",
  },
  booking: {
    orderNumber: "ORD-10042",
    tourName: "Uzbekistan group tour 5D/4N",
    pax: 12,
    dates: "2024-10-15 – 2024-10-20",
  },
  items: [
    {
      description: "Flight Tashkent — Samarkand",
      typ: "flight",
      quantity: 1,
      unitPrice: 200,
      amount: 200,
    },
    {
      description: "Hotel Hilton Tashkent",
      typ: "housing",
      quantity: 1,
      unitPrice: 360,
      amount: 360,
    },
    {
      description: "Meals",
      typ: "supplementary",
      quantity: 1,
      unitPrice: 0,
      amount: 0,
      children: [
        { description: "Breakfast", typ: "activity" },
        { description: "Lunch", typ: "activity" },
        { description: "Dinner", typ: "activity" },
      ],
    },
    {
      description: "Airport transfer",
      typ: "transfer",
      quantity: 1,
      unitPrice: 110,
      amount: 110,
    },
  ],
  totals: {
    subtotal: 670,
    tax: 0,
    discount: 0,
    paid: 500,
    remaining: 170,
    total: 670,
  },
  payment: {
    status: "paid",
    method: "Bank transfer",
    lines: [
      { label: "IBAN", value: "PT50 0000 0000 0000 0000 0000 0" },
      { label: "BIC", value: "BBPIPTPL" },
      { label: "Bank", value: "Millennium BCP" },
      { label: "Bank address", value: "Lisbon, Portugal" },
    ],
  },
  metadata: {
    notes: "Please arrange early check-in if possible.",
    terms: DEFAULT_INVOICE_TERMS,
    locale: "en",
  },
};
