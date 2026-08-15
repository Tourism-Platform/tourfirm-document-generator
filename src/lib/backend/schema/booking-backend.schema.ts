import { z } from "zod";

import { backendMoneySchema } from "./invoice-backend.schema";

export const backendBookingAgencySchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    business_name: z.string().nullable().optional(),
    legal_name: z.string().nullable().optional(),
    director_name: z.string().nullable().optional(),
    contact_person: z.string().nullable().optional(),
    contact_email: z.string().nullable().optional(),
    contact_phone: z.string().nullable().optional(),
    tax_id: z.string().nullable().optional(),
    address_line: z.string().nullable().optional(),
    city: z.string().nullable().optional(),
    country: z.string().nullable().optional(),
    logo_url: z.string().nullable().optional(),
  })
  .nullable()
  .optional();

export const backendOperatorInfoSchema = z
  .object({
    id: z.string().min(1).optional(),
    name: z.string().nullable().optional(),
    business_name: z.string().nullable().optional(),
    legal_name: z.string().nullable().optional(),
    director_name: z.string().nullable().optional(),
    contact_person: z.string().nullable().optional(),
    contact_email: z.string().nullable().optional(),
    contact_phone: z.string().nullable().optional(),
    tax_id: z.string().nullable().optional(),
    address_line: z.string().nullable().optional(),
    city: z.string().nullable().optional(),
    country: z.string().nullable().optional(),
    logo_url: z.string().nullable().optional(),
    logo_path: z.string().nullable().optional(),
  })
  .nullable()
  .optional();

export const backendBookingUserSchema = z
  .object({
    id: z.string().min(1),
    email: z.string().min(1),
    first_name: z.string().nullable().optional(),
    last_name: z.string().nullable().optional(),
    phone_number: z.string().nullable().optional(),
  })
  .nullable()
  .optional();

export const backendBookingTourSchema = z.object({
  title: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  typ: z.string().min(1),
  days: z.number().finite(),
  nights: z.number().finite(),
  route: z.array(z.string()).nullable().optional(),
});

export const backendBookingOrderSchema = z.object({
  id: z.string().min(1),
  order_number: z.string().min(1),
  date: z.string().min(1),
  end_date: z.string().min(1),
  pax: z.number().finite(),
  status: z.string().min(1),
  comment: z.string().nullable().optional(),
  tour_amount: backendMoneySchema.optional(),
  paid_amount: backendMoneySchema.optional(),
});

export const backendBookingResponseSchema = z.object({
  order: backendBookingOrderSchema,
  tour: backendBookingTourSchema,
  agency: backendBookingAgencySchema,
  user: backendBookingUserSchema,
  operator: backendOperatorInfoSchema,
});
