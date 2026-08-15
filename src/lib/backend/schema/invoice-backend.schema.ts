import { z } from "zod";

export const backendMoneySchema = z.union([z.string(), z.number()]);

const backendClassicSwiftDetailsSchema = z.object({
  typ: z.literal("classic_swift"),
  account_name_iban: z.string().nullable().optional(),
  swift_bic: z.string().nullable().optional(),
  bank_name: z.string().nullable().optional(),
  bank_address: z.string().nullable().optional(),
});

const backendCustomPaymentDetailsSchema = z.object({
  typ: z.literal("custom"),
  items: z
    .array(
      z.object({
        key: z.string().nullable().optional(),
        val: z.string().nullable().optional(),
      }),
    )
    .optional(),
});

export const backendPaymentDetailsSchema = z
  .union([backendClassicSwiftDetailsSchema, backendCustomPaymentDetailsSchema])
  .nullable()
  .optional();

export const backendInvoiceResponseSchema = z.object({
  id: z.string().min(1),
  invoice_number: z.string().min(1),
  booking_id: z.string().nullable(),
  order_number: z.string().nullable(),
  typ: z.string().min(1),
  status: z.string().min(1),
  amount: backendMoneySchema,
  currency: z.string().min(1),
  total: backendMoneySchema,
  paid_amount: backendMoneySchema,
  balance: backendMoneySchema,
  issued_at: z.string().nullable(),
  payment_details: backendPaymentDetailsSchema,
});
