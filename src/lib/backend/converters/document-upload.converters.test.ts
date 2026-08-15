import { describe, expect, it } from "vitest";
import { convertBackendUploadResponse } from "./document-upload.converters";
import { backendUploadResponseFixture } from "../../../../tests/fixtures/backend/upload-response";

describe("convertBackendUploadResponse", () => {
  it("maps backend upload id to documentId", () => {
    expect(convertBackendUploadResponse(backendUploadResponseFixture)).toEqual({
      documentId: "mock-document-id",
    });
  });
});
