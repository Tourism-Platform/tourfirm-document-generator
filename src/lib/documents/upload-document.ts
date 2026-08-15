import type { IDocumentUploadResult } from "@/types/document";
import { convertBackendUploadResponse } from "@/lib/backend/converters/document-upload.converters";
import type { IBackendClient, IUploadDocumentInput } from "@/lib/backend/backend-client.interface";
import { createBackendClient } from "@/lib/backend/client";

export async function uploadDocument(
  input: IUploadDocumentInput,
  backendClient: IBackendClient = createBackendClient(),
): Promise<IDocumentUploadResult> {
  const response = await backendClient.uploadDocument(input);
  return convertBackendUploadResponse(response);
}
