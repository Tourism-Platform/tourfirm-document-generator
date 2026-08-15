import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "playwright",
    "playwright-core",
    "@sparticuz/chromium",
    "react-dom/server",
    "@fontsource/exo-2",
  ],
  outputFileTracingIncludes: {
    "/api/documents/invoice": ["./node_modules/@fontsource/exo-2/files/**"],
    "/api/documents/invoice/mock": ["./node_modules/@fontsource/exo-2/files/**"],
    "/api/*": ["./node_modules/@fontsource/exo-2/files/**"],
  },
};

export default nextConfig;
