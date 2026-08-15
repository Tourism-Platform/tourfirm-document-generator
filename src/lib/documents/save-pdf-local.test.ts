import { describe, expect, it } from "vitest";
import { getLocalPdfRelativePath, toSafePdfFilename } from "./save-pdf-local";

describe("save-pdf-local", () => {
  it("builds a posix relative path", () => {
    expect(getLocalPdfRelativePath("invoice-example-id.pdf")).toBe(
      "generated/invoices/invoice-example-id.pdf",
    );
  });

  it("sanitizes invoice id for the filename", () => {
    expect(toSafePdfFilename("abc/../x")).toBe("invoice-abc_.._x.pdf");
  });
});
