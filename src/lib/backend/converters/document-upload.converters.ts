import type { IDocumentUploadResult } from "@/types/document";
import type { IBackendDocumentUploadResponse } from "@/lib/backend/types";

export function convertBackendUploadResponse(
  response: IBackendDocumentUploadResponse,
): IDocumentUploadResult {
  return {
    documentId: response.id,
  };
}
