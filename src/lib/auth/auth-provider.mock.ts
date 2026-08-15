import type { IAuthProvider, IAuthResult, IAuthorizeInput } from "./auth-provider.interface";

const MOCK_FORBIDDEN_COOKIE = "forbidden";

export class MockAuthProvider implements IAuthProvider {
  async authorize(input: IAuthorizeInput): Promise<IAuthResult> {
    const cookieHeader = input.cookieHeader?.trim() ?? "";

    if (!cookieHeader) {
      return {
        isAuthorized: false,
        status: "unauthorized",
      };
    }

    if (cookieHeader === MOCK_FORBIDDEN_COOKIE) {
      return {
        isAuthorized: false,
        status: "forbidden",
      };
    }

    return {
      isAuthorized: true,
      status: "authorized",
    };
  }
}
