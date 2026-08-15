import type { IInvoiceDocumentData } from "@/types/invoice";
import { InvoiceFooter } from "./InvoiceFooter";
import { InvoiceHeader } from "./InvoiceHeader";
import { InvoiceItems } from "./InvoiceItems";
import { InvoiceParties } from "./InvoiceParties";
import { InvoicePayment } from "./InvoicePayment";
import { InvoiceTotals } from "./InvoiceTotals";
import { getInvoiceDocumentCss } from "./invoice-document.styles";

interface IInvoiceDocumentProps {
  data: IInvoiceDocumentData;
}

export function InvoiceDocument({ data }: IInvoiceDocumentProps) {
  return (
    <article className="invoice">
      <style>{getInvoiceDocumentCss()}</style>
      <InvoiceHeader data={data} />
      <InvoiceParties seller={data.seller} customer={data.customer} />
      <InvoicePayment booking={data.booking} payment={data.payment} />
      <InvoiceItems items={data.items} currency={data.document.currency} />
      <InvoiceTotals totals={data.totals} currency={data.document.currency} />
      <InvoiceFooter metadata={data.metadata} />
    </article>
  );
}
