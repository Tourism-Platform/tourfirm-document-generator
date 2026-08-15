import { NextResponse } from "next/server";
import { generateInvoice } from "@/lib/documents/generate-invoice";
import { AppError } from "@/lib/errors/document-errors";
import { corsPreflightResponse, jsonWithCors } from "@/lib/http/cors";
import { log } from "@/lib/logger";
import { generateInvoiceRequestSchema } from "@/schemas/generate-invoice-request.schema";

export const runtime = "nodejs";
export const maxDuration = 60;

const PUBLIC_ERROR_MESSAGES: Record<number, string> = {
  400: "Invalid request body",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Invoice not found",
  422: "Invoice data is invalid",
  502: "Upstream service error",
  500: "Internal server error",
};

function jsonError(statusCode: number, request: Request): NextResponse {
  const error = PUBLIC_ERROR_MESSAGES[statusCode] ?? PUBLIC_ERROR_MESSAGES[500];
  return jsonWithCors({ error }, { status: statusCode, request });
}

function toErrorResponse(error: unknown, request: Request): NextResponse {
  if (error instanceof AppError) {
    log({
      event: "request_failed",
      errorCategory: error.category,
      statusCode: error.httpStatus,
    });

    return jsonError(error.httpStatus, request);
  }

  log({
    event: "request_failed",
    errorCategory: "unexpected",
    statusCode: 500,
  });

  return jsonError(500, request);
}

export async function OPTIONS(request: Request) {
  return corsPreflightResponse(request);
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonError(400, request);
  }

  const parsed = generateInvoiceRequestSchema.safeParse(body);

  if (!parsed.success) {
    return jsonError(400, request);
  }

  try {
    const result = await generateInvoice({
      invoiceId: parsed.data.invoiceId,
      request,
    });

    return jsonWithCors(result, { request });
  } catch (error) {
    return toErrorResponse(error, request);
  }
}
