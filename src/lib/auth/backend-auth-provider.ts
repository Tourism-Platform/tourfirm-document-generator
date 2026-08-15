import { convertBackendAuthResponse } from "@/lib/backend/converters/auth.converters";
import type { IBackendClient } from "@/lib/backend/backend-client.interface";
import type { IAuthProvider, IAuthResult, IAuthorizeInput } from "./auth-provider.interface";

export class BackendAuthProvider implements IAuthProvider {
  constructor(private readonly backendClient: IBackendClient) {}

  async authorize(input: IAuthorizeInput): Promise<IAuthResult> {
    const response = await this.backendClient.authorize(input);
    return convertBackendAuthResponse(response);
  }
}
