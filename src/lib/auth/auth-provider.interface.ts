export type TAuthStatus = "authorized" | "unauthorized" | "forbidden";

export interface IAuthResult {
  isAuthorized: boolean;
  status: TAuthStatus;
}

export interface IAuthContext {
  cookieHeader: string | null;
  authorization: IAuthResult;
}

export interface IAuthorizeInput {
  cookieHeader: string | null;
}

export interface IAuthProvider {
  authorize(input: IAuthorizeInput): Promise<IAuthResult>;
}
