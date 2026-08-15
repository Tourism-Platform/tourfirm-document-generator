import type { z } from "zod";

import { backendDocumentUploadResponseSchema } from "../schema/document-upload-backend.schema";

export type IBackendDocumentUploadResponse = z.infer<
  typeof backendDocumentUploadResponseSchema
>;
