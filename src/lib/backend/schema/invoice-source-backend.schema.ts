import { z } from "zod";

import {
  backendBookingResponseSchema,
  backendOperatorInfoSchema,
} from "./booking-backend.schema";
import { backendInvoiceResponseSchema } from "./invoice-backend.schema";
import { backendItineraryResponseSchema } from "./itinerary-backend.schema";

export const backendInvoiceSourceSchema = z.object({
  invoice: backendInvoiceResponseSchema,
  booking: backendBookingResponseSchema.nullable(),
  itinerary: backendItineraryResponseSchema.nullable(),
  operator: backendOperatorInfoSchema,
});
