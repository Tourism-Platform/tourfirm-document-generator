import { createRequire } from "node:module";
import { createElement } from "react";
import { InvoiceDocument } from "@/components/invoice/InvoiceDocument";
import type { IInvoiceDocumentData } from "@/types/invoice";

interface IReactDomServer {
  renderToStaticMarkup: (element: ReturnType<typeof createElement>) => string;
}

function getRenderToStaticMarkup(): IReactDomServer["renderToStaticMarkup"] {
  const loaders = [
    () => createRequire(import.meta.url)("react-dom/server") as IReactDomServer,
    () =>
      createRequire(`${process.cwd()}/package.json`)(
        "react-dom/server",
      ) as IReactDomServer,
  ];

  for (const load of loaders) {
    try {
      return load().renderToStaticMarkup;
    } catch {
      // try the next loader
    }
  }

  throw new Error("react-dom/server is not available");
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function renderInvoiceHtml(data: IInvoiceDocumentData): string {
  const renderToStaticMarkup = getRenderToStaticMarkup();
  const body = renderToStaticMarkup(createElement(InvoiceDocument, { data }));
  const title = escapeHtml(`Invoice ${data.document.number}`);
  const lang = escapeHtml(data.metadata.locale ?? "en");

  return `<!DOCTYPE html>
<html lang="${lang}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
  </head>
  <body>
    ${body}
  </body>
</html>`;
}
