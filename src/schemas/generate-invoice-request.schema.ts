import { z } from "zod";

export const generateInvoiceRequestSchema = z.object({
  invoiceId: z.string().min(1),
});

export type TGenerateInvoiceRequest = z.infer<typeof generateInvoiceRequestSchema>;
