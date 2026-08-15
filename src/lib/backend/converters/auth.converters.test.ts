import { describe, expect, it } from "vitest";
import { convertBackendAuthResponse } from "./auth.converters";
import { backendAuthResponseFixture } from "../../../../tests/fixtures/backend/auth-response";

describe("convertBackendAuthResponse", () => {
  it("marks a valid backend account as authorized", () => {
    expect(convertBackendAuthResponse(backendAuthResponseFixture)).toEqual({
      isAuthorized: true,
      status: "authorized",
    });
  });

  it("marks a blank identity as unauthorized", () => {
    expect(
      convertBackendAuthResponse({
        ...backendAuthResponseFixture,
        id: "   ",
      }),
    ).toEqual({
      isAuthorized: false,
      status: "unauthorized",
    });
  });
});
