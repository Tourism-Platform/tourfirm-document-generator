import { describe, expect, it } from "vitest";
import { POST } from "./route";

function createPostRequest(body: unknown, cookie?: string): Request {
  const headers = new Headers({
    "content-type": "application/json",
  });

  if (cookie) {
    headers.set("cookie", cookie);
  }

  return new Request("http://localhost/api/documents/invoice", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

describe("POST /api/documents/invoice", () => {
  it("returns 400 for an invalid request body", async () => {
    const response = await POST(createPostRequest({}));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Invalid request body" });
  });

  it("returns 401 for an unauthorized request", async () => {
    const response = await POST(createPostRequest({ invoiceId: "example-id" }));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
  });

  it("returns 403 for a forbidden mock cookie", async () => {
    const response = await POST(createPostRequest({ invoiceId: "example-id" }, "forbidden"));

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ error: "Forbidden" });
  });

  it("returns a documentId for an authorized mock request", async () => {
    const response = await POST(createPostRequest({ invoiceId: "example-id" }, "session=test"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ documentId: "mock-document-id" });
  });
});
