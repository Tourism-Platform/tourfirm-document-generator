import { getExo2FontFaceCss } from "@/lib/invoice/exo2-font-face";

export const invoiceDocumentCss = `:root {
  --primary: #36bffa;
  --primary-foreground: #ffffff;
  --foreground: #1a1a2e;
  --muted-foreground: #6b7280;
  --border: #e5e7eb;
  --card: #ffffff;
}

@page {
  size: A4;
  margin: 12mm 14mm 16mm 14mm;
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  background: var(--card);
  color: var(--foreground);
  font-family: "Exo 2", system-ui, sans-serif;
  font-size: 9.5pt;
  font-weight: 400;
  line-height: 1.4;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.invoice {
  width: 100%;
  max-width: 182mm;
  margin: 0 auto;
}

.invoice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border);
  break-inside: avoid;
}

.invoice-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.invoice-monogram {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--primary);
  color: var(--primary-foreground);
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0;
  flex-shrink: 0;
}

.invoice-brand-name {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--foreground);
}

.invoice-header-meta {
  margin: 0;
  text-align: right;
}

.invoice-header-meta div + div {
  margin-top: 6px;
}

.invoice-header-meta dt {
  margin: 0;
  font-size: 8.5pt;
  font-weight: 500;
  color: var(--muted-foreground);
}

.invoice-header-meta dd {
  margin: 0;
  font-weight: 600;
  color: var(--foreground);
}

.invoice-section-label {
  margin: 0 0 8px;
  font-size: 9pt;
  font-weight: 600;
  color: var(--primary);
}

.invoice-parties,
.invoice-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 28px;
  margin: 16px 0 0;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border);
  break-inside: avoid;
}

.invoice-party-field,
.invoice-info-field {
  display: grid;
  grid-template-columns: 76px 1fr;
  gap: 8px;
  margin: 0 0 4px;
  align-items: start;
}

.invoice-party-field-label,
.invoice-info-label {
  font-weight: 500;
  color: var(--muted-foreground);
}

.invoice-party-field-value,
.invoice-info-value {
  color: var(--foreground);
  font-weight: 500;
  word-break: break-word;
}

.invoice-items {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0 8px;
}

.invoice-items thead {
  display: table-header-group;
}

.invoice-items th {
  padding: 6px 8px;
  border-bottom: 1px solid var(--border);
  font-size: 8.5pt;
  font-weight: 600;
  color: var(--muted-foreground);
  text-align: left;
}

.invoice-items th.numeric,
.invoice-items td.numeric {
  text-align: right;
  white-space: nowrap;
}

.invoice-items th.col-no,
.invoice-items td.col-no {
  width: 36px;
  color: var(--muted-foreground);
}

.invoice-items td {
  padding: 7px 8px;
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
}

.invoice-items tbody tr {
  break-inside: avoid;
  page-break-inside: avoid;
}

.invoice-item-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--foreground);
  font-weight: 500;
}

.invoice-item-label.is-child {
  padding-left: 8px;
  color: var(--muted-foreground);
  font-weight: 400;
}

.invoice-item-icon {
  color: var(--primary);
  flex-shrink: 0;
}

.invoice-item-child td {
  border-bottom: 1px solid var(--border);
}

.invoice-summary {
  display: flex;
  justify-content: flex-end;
  margin: 4px 0 18px;
  break-inside: avoid;
  page-break-inside: avoid;
}

.invoice-totals {
  width: 240px;
}

.invoice-totals-row {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding: 5px 0;
  font-weight: 500;
  color: var(--muted-foreground);
}

.invoice-totals-row.total {
  margin-top: 2px;
  padding-top: 8px;
  border-top: 1px solid var(--border);
  font-size: 11pt;
  font-weight: 700;
  color: var(--foreground);
}

.invoice-footer {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 28px;
  padding-top: 14px;
  border-top: 1px solid var(--border);
  break-inside: avoid;
}

.invoice-footer-text {
  margin: 0;
  font-weight: 400;
  color: var(--muted-foreground);
}

@media print {
  body {
    background: var(--card);
  }

  .invoice-items thead {
    display: table-header-group;
  }

  .invoice-items tbody tr,
  .invoice-summary,
  .invoice-parties,
  .invoice-info-grid,
  .invoice-header,
  .invoice-footer {
    break-inside: avoid;
    page-break-inside: avoid;
  }
}
`;

export function getInvoiceDocumentCss(): string {
  return `${getExo2FontFaceCss()}\n${invoiceDocumentCss}`;
}
