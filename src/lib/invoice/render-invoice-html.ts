import { createRequire } from "node:module";
import { createElement } from "react";
import { InvoiceDocument } from "@/components/invoice/InvoiceDocument";
import type { IInvoiceDocumentData } from "@/types/invoice";

interface IReactDomServer {
  renderToStaticMarkup: (element: ReturnType<typeof createElement>) => string;
}

function getRenderToStaticMarkup(): IReactDomServer["renderToStaticMarkup"] {
  const require = createRequire(process.cwd() + "/package.json");
  const reactDomServer = require("react-dom/server") as IReactDomServer;
  return reactDomServer.renderToStaticMarkup;
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
