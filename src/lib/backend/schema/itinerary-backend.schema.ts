import { z } from "zod";

import { backendMoneySchema } from "./invoice-backend.schema";

export const backendItineraryEventDetailSchema = z.object({
  name: z.string().nullable().optional(),
  typ: z.string().optional(),
});

export const backendItineraryEventSchema = z.object({
  name: z.string().nullable().optional(),
  typ: z.string().optional(),
  day: z.number().finite().nullable().optional(),
  position: z.number().finite().nullable().optional(),
  cost: backendMoneySchema.optional(),
  markup: backendMoneySchema.optional(),
  fees: backendMoneySchema.optional(),
  details: z.array(backendItineraryEventDetailSchema).optional(),
});

export const backendItineraryResponseSchema = z.object({
  booking_id: z.string().min(1),
  order_number: z.string().min(1),
  display_lang: z.string().optional(),
  events: z.array(backendItineraryEventSchema),
});
