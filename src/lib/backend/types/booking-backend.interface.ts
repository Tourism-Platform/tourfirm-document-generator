import type { z } from "zod";

import { backendBookingResponseSchema } from "../schema/booking-backend.schema";

export type IBackendBookingResponse = z.infer<typeof backendBookingResponseSchema>;
