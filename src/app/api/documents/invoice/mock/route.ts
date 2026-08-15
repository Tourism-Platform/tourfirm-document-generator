import { NextResponse } from "next/server";
import { generateInvoiceMock } from "@/lib/documents/generate-invoice-mock";
import { AppError } from "@/lib/errors/document-errors";
import { corsPreflightResponse, jsonWithCors } from "@/lib/http/cors";
import { log } from "@/lib/logger";

export const runtime = "nodejs";
export const maxDuration = 60;

const PUBLIC_ERROR_MESSAGES: Record<number, string> = {
  404: "Invoice not found",
  422: "Invoice data is invalid",
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

function readInvoiceId(body: unknown): string | undefined {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return undefined;
  }

  const invoiceId = (body as { invoiceId?: unknown }).invoiceId;
  return typeof invoiceId === "string" ? invoiceId : undefined;
}

export async function OPTIONS(request: Request) {
  return corsPreflightResponse(request);
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    const text = await request.text();
    body = text.trim().length > 0 ? JSON.parse(text) : {};
  } catch {
    body = {};
  }

  try {
    const result = await generateInvoiceMock({
      invoiceId: readInvoiceId(body),
    });

    return jsonWithCors(result, { request });
  } catch (error) {
    return toErrorResponse(error, request);
  }
}
