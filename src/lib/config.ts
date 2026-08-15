export interface IAppConfig {
  useMockBackend: boolean;
  backendUrl: string | undefined;
  documentServiceSecret: string | undefined;
  isVercel: boolean;
}

export function getConfig(): IAppConfig {
  return {
    useMockBackend: process.env.USE_MOCK_BACKEND !== "false",
    backendUrl: process.env.BACKEND_URL || undefined,
    documentServiceSecret: process.env.DOCUMENT_SERVICE_SECRET || undefined,
    isVercel: process.env.VERCEL === "1",
  };
}
