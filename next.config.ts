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
    "/api/documents/invoice": [
      "./node_modules/@fontsource/exo-2/files/**",
      "./node_modules/playwright-core/**",
      "./node_modules/@sparticuz/chromium/**",
    ],
    "/api/documents/invoice/mock": ["./node_modules/@fontsource/exo-2/files/**"],
    "/api/*": [
      "./node_modules/@fontsource/exo-2/files/**",
      "./node_modules/playwright-core/**",
      "./node_modules/@sparticuz/chromium/**",
    ],
  },
};

export default nextConfig;
