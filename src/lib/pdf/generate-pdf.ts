import { getExo2FontFaceCss } from "@/lib/invoice/exo2-font-face";
import type { Browser } from "playwright-core";
import { PdfGenerationError } from "@/lib/errors/document-errors";
import { launchBrowser } from "./launch-browser";

function getPdfFooterTemplate(): string {
  return `
    <style>${getExo2FontFaceCss([400])}</style>
    <div style="width:100%;font-size:10px;color:#6b7280;font-family:'Exo 2',system-ui,sans-serif;text-align:center;padding:0 16mm 4px;">
      <span class="pageNumber"></span> / <span class="totalPages"></span>
    </div>
  `;
}

export async function generatePdf(html: string): Promise<Buffer> {
  let browser: Browser | undefined;

  try {
    browser = await launchBrowser();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    await page.emulateMedia({ media: "print" });

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

    return Buffer.from(pdf);
  } catch (error) {
    if (error instanceof PdfGenerationError) {
      throw error;
    }

    throw new PdfGenerationError("Failed to generate PDF document");
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
