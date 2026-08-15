export type THttpErrorStatus = 401 | 403 | 404 | 422 | 502 | 500;

export class AppError extends Error {
  readonly category: string;
  readonly httpStatus: THttpErrorStatus;

  constructor(message: string, category: string, httpStatus: THttpErrorStatus) {
    super(message);
    this.name = "AppError";
    this.category = category;
    this.httpStatus = httpStatus;
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string, httpStatus: 401 | 403 = 401) {
    super(message, "authentication", httpStatus);
    this.name = "AuthenticationError";
  }
}

export class BackendRequestError extends AppError {
  constructor(message: string) {
    super(message, "backend_request", 502);
    this.name = "BackendRequestError";
  }
}

export class InvoiceDataError extends AppError {
  constructor(message: string, httpStatus: 404 | 422 = 422) {
    super(message, "invoice_data", httpStatus);
    this.name = "InvoiceDataError";
  }
}

export class PdfGenerationError extends AppError {
  constructor(message: string) {
    super(message, "pdf_generation", 500);
    this.name = "PdfGenerationError";
  }
}

export class DocumentUploadError extends AppError {
  constructor(message: string) {
    super(message, "document_upload", 502);
    this.name = "DocumentUploadError";
  }
}
