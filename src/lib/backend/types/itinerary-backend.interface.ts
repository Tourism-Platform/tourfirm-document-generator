import type { z } from "zod";

import { backendItineraryResponseSchema } from "../schema/itinerary-backend.schema";

export type IBackendItineraryResponse = z.infer<typeof backendItineraryResponseSchema>;
