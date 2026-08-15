import { z } from "zod";

export const backendAuthResponseSchema = z.object({
  id: z.string().min(1),
  email: z.string().min(1),
  role: z.string().min(1),
  picture: z.string().nullable().optional(),
  agency_id: z.string().nullable().optional(),
  operator_id: z.string().nullable().optional(),
});
