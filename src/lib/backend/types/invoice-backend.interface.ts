import type { z } from "zod";

import { backendInvoiceResponseSchema } from "../schema/invoice-backend.schema";
import { backendInvoiceSourceSchema } from "../schema/invoice-source-backend.schema";

export type IBackendInvoiceResponse = z.infer<typeof backendInvoiceResponseSchema>;
export type IBackendInvoiceSource = z.infer<typeof backendInvoiceSourceSchema>;
