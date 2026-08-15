import { getConfig } from "@/lib/config";
import type { IBackendClient } from "@/lib/backend/backend-client.interface";
import { BackendAuthProvider } from "./backend-auth-provider";
import { MockAuthProvider } from "./auth-provider.mock";
import type { IAuthProvider } from "./auth-provider.interface";

export function createAuthProvider(backendClient: IBackendClient): IAuthProvider {
  const config = getConfig();

  if (config.useMockBackend) {
    return new MockAuthProvider();
  }

  return new BackendAuthProvider(backendClient);
}
