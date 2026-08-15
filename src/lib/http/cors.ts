import { NextResponse } from "next/server";

const DEFAULT_ORIGINS = [
  "http://127.0.0.1:5173",
  "http://localhost:5173",
];

function allowedOrigins(): string[] {
  const fromEnv = process.env.FRONTEND_ORIGINS;

  if (!fromEnv?.trim()) {
    return DEFAULT_ORIGINS;
  }

  return fromEnv
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
}

function corsHeaders(request?: Request): Record<string, string> {
  const origins = allowedOrigins();
  const requestOrigin = request?.headers.get("origin");
  const allowOrigin =
    requestOrigin && origins.includes(requestOrigin) ? requestOrigin : origins[0];

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

export function withCors(response: NextResponse, request?: Request): NextResponse {
  for (const [key, value] of Object.entries(corsHeaders(request))) {
    response.headers.set(key, value);
  }

  return response;
}

export function corsPreflightResponse(request?: Request): NextResponse {
  return withCors(new NextResponse(null, { status: 204 }), request);
}

export function jsonWithCors(
  data: unknown,
  init?: { status?: number; request?: Request },
): NextResponse {
  return withCors(NextResponse.json(data, { status: init?.status }), init?.request);
}
