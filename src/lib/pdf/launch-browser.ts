import type { Browser } from "playwright-core";
import { getConfig } from "@/lib/config";

export async function launchBrowser(): Promise<Browser> {
  const config = getConfig();

  if (config.isVercel) {
    const { chromium: playwright } = await import("playwright-core");
    const { default: chromium } = await import("@sparticuz/chromium");

    return playwright.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }

  const { chromium } = await import("playwright");

  return chromium.launch({
    headless: true,
  });
}
