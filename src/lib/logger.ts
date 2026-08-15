export interface ILogFields {
  event: string;
  requestId?: string;
  isAuthorized?: boolean;
  authStatus?: string;
  invoiceDataFetchDurationMs?: number;
  pdfGenerationDurationMs?: number;
  uploadDurationMs?: number;
  totalDurationMs?: number;
  documentId?: string;
  errorCategory?: string;
  statusCode?: number;
  errorMessage?: string;
}

export function log(fields: ILogFields): void {
  const line = JSON.stringify({
    timestamp: new Date().toISOString(),
    ...fields,
  });

  process.stdout.write(`${line}\n`);
}
