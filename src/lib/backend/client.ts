import { getConfig } from "@/lib/config";
import type { IBackendClient } from "./backend-client.interface";
import { BackendClient } from "./backend-client";
import { MockBackendClient } from "./backend-client.mock";

export function createBackendClient(): IBackendClient {
  const config = getConfig();

  if (config.useMockBackend) {
    return new MockBackendClient();
  }

  return new BackendClient();
}
