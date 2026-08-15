import type { z } from "zod";

import { backendAuthResponseSchema } from "../schema/auth-backend.schema";

export type IBackendAuthResponse = z.infer<typeof backendAuthResponseSchema>;
