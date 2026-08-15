import type { IAuthContext, IAuthProvider } from "./auth-provider.interface";

export function extractCookieHeader(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie");

  if (!cookieHeader || cookieHeader.trim().length === 0) {
    return null;
  }

  return cookieHeader;
}

export async function validateRequestAuthorization(
  request: Request,
  authProvider: IAuthProvider,
): Promise<IAuthContext> {
  const cookieHeader = extractCookieHeader(request);
  const authorization = await authProvider.authorize({ cookieHeader });

  return {
    cookieHeader,
    authorization,
  };
}
