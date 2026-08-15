import { z } from "zod";

const invoicePartySchema = z.object({
  name: z.string().min(1),
  addressLines: z.array(z.string().min(1)).min(1),
  contact: z.string().min(1).optional(),
  email: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  taxId: z.string().min(1).optional(),
});

const invoiceItemChildSchema = z.object({
  description: z.string().min(1),
  typ: z.string().min(1).optional(),
});

const invoiceItemSchema = z.object({
  description: z.string().min(1),
  typ: z.string().min(1).optional(),
  quantity: z.number().finite(),
  unitPrice: z.number().finite(),
  amount: z.number().finite(),
  children: z.array(invoiceItemChildSchema).optional(),
});

export const invoiceDocumentDataSchema = z.object({
  document: z.object({
    number: z.string().min(1),
    issuedAt: z.string().min(1),
    dueAt: z.string().min(1).optional(),
    currency: z.string().min(1),
  }),
  brand: z.object({
    name: z.string().min(1),
  }),
  seller: invoicePartySchema,
  customer: invoicePartySchema,
  booking: z
    .object({
      orderNumber: z.string().min(1),
      tourName: z.string().min(1),
      pax: z.number().finite(),
      dates: z.string().min(1),
    })
    .optional(),
  items: z.array(invoiceItemSchema).min(1),
  totals: z.object({
    subtotal: z.number().finite(),
    tax: z.number().finite(),
    discount: z.number().finite(),
    paid: z.number().finite(),
    remaining: z.number().finite(),
    total: z.number().finite(),
  }),
  payment: z.object({
    status: z.string().min(1),
    method: z.string().min(1).optional(),
    dueAt: z.string().min(1).optional(),
    lines: z
      .array(
        z.object({
          label: z.string().min(1),
          value: z.string().min(1),
        }),
      )
      .optional(),
  }),
  metadata: z.object({
    notes: z.string().optional(),
    terms: z.string().optional(),
    locale: z.string().optional(),
  }),
});

export type TInvoiceDocumentData = z.infer<typeof invoiceDocumentDataSchema>;
