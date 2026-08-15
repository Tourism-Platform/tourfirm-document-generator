import { describe, expect, it } from "vitest";
import { MockAuthProvider } from "./auth-provider.mock";
import { validateRequestAuthorization } from "./validate-request";

function createRequest(cookie?: string): Request {
  const headers = new Headers();

  if (cookie) {
    headers.set("cookie", cookie);
  }

  return new Request("http://localhost/api/documents/invoice", {
    method: "POST",
    headers,
  });
}

describe("validateRequestAuthorization", () => {
  const authProvider = new MockAuthProvider();

  it("marks a request without a Cookie header as unauthorized", async () => {
    const result = await validateRequestAuthorization(createRequest(), authProvider);

    expect(result.cookieHeader).toBeNull();
    expect(result.authorization.isAuthorized).toBe(false);
    expect(result.authorization.status).toBe("unauthorized");
  });

  it("marks a request with a Cookie header as authorized", async () => {
    const result = await validateRequestAuthorization(
      createRequest("session=test"),
      authProvider,
    );

    expect(result.cookieHeader).toBe("session=test");
    expect(result.authorization.isAuthorized).toBe(true);
    expect(result.authorization.status).toBe("authorized");
  });

  it("marks the mock forbidden cookie as forbidden", async () => {
    const result = await validateRequestAuthorization(
      createRequest("forbidden"),
      authProvider,
    );

    expect(result.authorization.isAuthorized).toBe(false);
    expect(result.authorization.status).toBe("forbidden");
  });
});
