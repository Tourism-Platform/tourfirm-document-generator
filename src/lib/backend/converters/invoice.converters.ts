import type {
  IInvoiceBooking,
  IInvoiceBrand,
  IInvoiceDocumentData,
  IInvoiceItem,
  IInvoiceItemChild,
  IInvoiceParty,
  IInvoicePaymentLine,
} from "@/types/invoice";
import { InvoiceDataError } from "@/lib/errors/document-errors";
import type { IBackendInvoiceSource } from "@/lib/backend/types";
import { invoiceDocumentDataSchema } from "@/schemas/invoice.schema";

const MISSING_VALUE = "-";

export const DEFAULT_INVOICE_TERMS =
  "For a full refund, you must cancel at least 24 hours before the experience's start time.";

function parseMoney(value: string | number | undefined): number {
  if (value === undefined) {
    return 0;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  const parsed = Number.parseFloat(value.replace(/^\+/, "").trim());
  return Number.isFinite(parsed) ? parsed : 0;
}

function toDocumentDate(value: string | null | undefined): string {
  if (!value || value.trim().length === 0) {
    return MISSING_VALUE;
  }

  const isoDate = value.slice(0, 10);

  if (/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
    return isoDate;
  }

  return value;
}

function compactLines(values: Array<string | null | undefined>): string[] {
  return values
    .map((value) => value?.trim() ?? "")
    .filter((value) => value.length > 0);
}

function firstNonEmpty(
  values: Array<string | null | undefined>,
): string | undefined {
  for (const value of values) {
    const trimmed = value?.trim() ?? "";

    if (trimmed.length > 0) {
      return trimmed;
    }
  }

  return undefined;
}

function toParty(profile: {
  name?: string | null;
  business_name?: string | null;
  legal_name?: string | null;
  contact_person?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  tax_id?: string | null;
  address_line?: string | null;
  city?: string | null;
  country?: string | null;
} | null | undefined): IInvoiceParty {
  if (!profile) {
    return {
      name: MISSING_VALUE,
      addressLines: [MISSING_VALUE],
    };
  }

  const name =
    firstNonEmpty([profile.legal_name, profile.business_name, profile.name]) ??
    MISSING_VALUE;
  const addressLines = compactLines([
    profile.address_line,
    profile.city,
    profile.country,
  ]);
  const contact = profile.contact_person?.trim();
  const email = profile.contact_email?.trim();
  const phone = profile.contact_phone?.trim();
  const taxId = profile.tax_id?.trim();

  return {
    name,
    addressLines: addressLines.length > 0 ? addressLines : [MISSING_VALUE],
    contact: contact && contact.length > 0 ? contact : undefined,
    email: email && email.length > 0 ? email : undefined,
    phone: phone && phone.length > 0 ? phone : undefined,
    taxId: taxId && taxId.length > 0 ? taxId : undefined,
  };
}

function toCustomer(source: IBackendInvoiceSource["booking"]): IInvoiceParty {
  return toParty(source?.agency);
}

function toSeller(source: IBackendInvoiceSource): IInvoiceParty {
  return toParty(source.operator ?? source.booking?.operator);
}

function toBrand(source: IBackendInvoiceSource): IInvoiceBrand {
  const operator = source.operator ?? source.booking?.operator;
  const name =
    firstNonEmpty([
      operator?.business_name,
      operator?.legal_name,
      operator?.name,
    ]) ?? "Invoice";

  return { name };
}

function toTourName(booking: NonNullable<IBackendInvoiceSource["booking"]>): string {
  const title =
    firstNonEmpty([booking.tour.title, booking.tour.name]) ?? MISSING_VALUE;
  const { days, nights } = booking.tour;

  if (days > 0 || nights > 0) {
    return `${title} ${days}D/${nights}N`;
  }

  return title;
}

function toBooking(
  source: IBackendInvoiceSource["booking"],
): IInvoiceBooking | undefined {
  if (!source) {
    return undefined;
  }

  return {
    orderNumber: source.order.order_number,
    tourName: toTourName(source),
    pax: source.order.pax,
    dates: `${toDocumentDate(source.order.date)} – ${toDocumentDate(source.order.end_date)}`,
  };
}

function toItemChildren(
  details: NonNullable<IBackendInvoiceSource["itinerary"]>["events"][number]["details"],
): IInvoiceItemChild[] | undefined {
  const children = (details ?? []).reduce<IInvoiceItemChild[]>((acc, detail) => {
    const description = detail.name?.trim() ?? "";

    if (!description) {
      return acc;
    }

    const typ = detail.typ?.trim();
    acc.push(typ ? { description, typ } : { description });
    return acc;
  }, []);

  return children.length > 0 ? children : undefined;
}

function toItems(source: IBackendInvoiceSource["itinerary"]): IInvoiceItem[] {
  const events = source?.events ?? [];
  const items: IInvoiceItem[] = [];

  for (const event of events) {
    const title = event.name?.trim() ?? "";
    const children = toItemChildren(event.details);
    const amount =
      parseMoney(event.cost) + parseMoney(event.markup) + parseMoney(event.fees);

    if (!title && !children) {
      continue;
    }

    items.push({
      description: title.length > 0 ? title : MISSING_VALUE,
      typ: event.typ?.trim() || undefined,
      quantity: 1,
      unitPrice: amount,
      amount,
      children,
    });
  }

  if (items.length === 0) {
    return [
      {
        description: MISSING_VALUE,
        quantity: 1,
        unitPrice: 0,
        amount: 0,
      },
    ];
  }

  return items;
}

function toPaymentMethod(
  details: IBackendInvoiceSource["invoice"]["payment_details"],
): string | undefined {
  if (!details) {
    return undefined;
  }

  if (details.typ === "classic_swift") {
    return "Bank transfer";
  }

  if (details.typ === "custom") {
    return "Custom";
  }

  return undefined;
}

function toPaymentLines(
  details: IBackendInvoiceSource["invoice"]["payment_details"],
): IInvoicePaymentLine[] | undefined {
  if (!details) {
    return undefined;
  }

  const lines: IInvoicePaymentLine[] = [];

  if (details.typ === "classic_swift") {
    const candidates: Array<[string, string | null | undefined]> = [
      ["IBAN", details.account_name_iban],
      ["BIC", details.swift_bic],
      ["Bank", details.bank_name],
      ["Bank address", details.bank_address],
    ];

    for (const [label, value] of candidates) {
      const trimmed = value?.trim() ?? "";

      if (trimmed.length > 0) {
        lines.push({ label, value: trimmed });
      }
    }
  }

  if (details.typ === "custom") {
    for (const item of details.items ?? []) {
      const label = item.key?.trim() ?? "";
      const value = item.val?.trim() ?? "";

      if (label.length > 0 && value.length > 0) {
        lines.push({ label, value });
      }
    }
  }

  return lines.length > 0 ? lines : undefined;
}

function toNotes(source: IBackendInvoiceSource["booking"]): string | undefined {
  const comment = source?.order.comment?.trim() ?? "";
  return comment.length > 0 ? comment : undefined;
}

export function convertBackendInvoiceToDocument(
  source: IBackendInvoiceSource,
): IInvoiceDocumentData {
  const { invoice, booking, itinerary } = source;

  const mapped: IInvoiceDocumentData = {
    document: {
      number: invoice.invoice_number,
      issuedAt: toDocumentDate(invoice.issued_at),
      currency: invoice.currency,
    },
    brand: toBrand(source),
    seller: toSeller(source),
    customer: toCustomer(booking),
    booking: toBooking(booking),
    items: toItems(itinerary),
    totals: {
      subtotal: parseMoney(invoice.amount),
      tax: 0,
      discount: 0,
      paid: parseMoney(invoice.paid_amount),
      remaining: parseMoney(invoice.balance),
      total: parseMoney(invoice.total),
    },
    payment: {
      status: invoice.status,
      method: toPaymentMethod(invoice.payment_details),
      lines: toPaymentLines(invoice.payment_details),
    },
    metadata: {
      notes: toNotes(booking),
      terms: DEFAULT_INVOICE_TERMS,
      locale: itinerary?.display_lang,
    },
  };

  const parsed = invoiceDocumentDataSchema.safeParse(mapped);

  if (!parsed.success) {
    throw new InvoiceDataError("Invoice data could not be normalized", 422);
  }

  return parsed.data;
}
