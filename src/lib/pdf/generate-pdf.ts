import { getExo2FontFaceCss } from "@/lib/invoice/exo2-font-face";
import type { Browser } from "playwright-core";
import { PdfGenerationError } from "@/lib/errors/document-errors";
import { log } from "@/lib/logger";
import { launchBrowser } from "./launch-browser";

function getPdfFooterTemplate(): string {
  return `
    <style>${getExo2FontFaceCss([400])}</style>
    <div style="width:100%;font-size:10px;color:#6b7280;font-family:'Exo 2',system-ui,sans-serif;text-align:center;padding:0 16mm 4px;">
      <span class="pageNumber"></span> / <span class="totalPages"></span>
    </div>
  `;
}

function toErrorFields(error: unknown): {
  errorName?: string;
  errorMessage?: string;
  errorStack?: string;
} {
  if (!(error instanceof Error)) {
    return {
      errorName: "UnknownError",
      errorMessage: "Unknown error",
    };
  }

  return {
    errorName: error.name,
    errorMessage: error.message,
    errorStack: error.stack,
  };
}

export async function generatePdf(html: string, requestId?: string): Promise<Buffer> {
  let browser: Browser | undefined;

  try {
    log({
      event: "chromium_launch_started",
      requestId,
    });
    browser = await launchBrowser();
    log({
      event: "chromium_launch_success",
      requestId,
    });

    log({
      event: "pdf_page_started",
      requestId,
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    await page.emulateMedia({ media: "print" });
    log({
      event: "pdf_page_success",
      requestId,
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: true,
      headerTemplate: "<div></div>",
      footerTemplate: getPdfFooterTemplate(),
      margin: {
        top: "0",
        right: "0",
        bottom: "12mm",
        left: "0",
      },
    });

    log({
      event: "pdf_generated",
      requestId,
    });

    return Buffer.from(pdf);
  } catch (error) {
    if (error instanceof PdfGenerationError) {
      throw error;
    }

    log({
      event: "pdf_generation_failed",
      requestId,
      errorCategory: "pdf_generation",
      statusCode: 500,
      ...toErrorFields(error),
    });

    throw new PdfGenerationError("Failed to generate PDF document");
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
