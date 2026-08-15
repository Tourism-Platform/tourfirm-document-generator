import type { IAuthResult } from "@/lib/auth/auth-provider.interface";
import type { IBackendAuthResponse } from "@/lib/backend/types";

export function convertBackendAuthResponse(
  response: IBackendAuthResponse,
): IAuthResult {
  if (response.id.trim().length === 0 || response.email.trim().length === 0) {
    return {
      isAuthorized: false,
      status: "unauthorized",
    };
  }

  return {
    isAuthorized: true,
    status: "authorized",
  };
}
