import { formatDate } from "@/lib/invoice/format-money";
import type { IInvoiceDocumentData } from "@/types/invoice";

interface IInvoiceMetaProps {
  data: IInvoiceDocumentData;
}

export function InvoiceMeta({ data }: IInvoiceMetaProps) {
  return (
    <dl className="invoice-meta">
      <div className="invoice-meta-item">
        <dt>Issue date</dt>
        <dd>{formatDate(data.document.issuedAt)}</dd>
      </div>
      <div className="invoice-meta-item">
        <dt>Due date</dt>
        <dd>{data.document.dueAt ? formatDate(data.document.dueAt) : "—"}</dd>
      </div>
      <div className="invoice-meta-item">
        <dt>Currency</dt>
        <dd>{data.document.currency}</dd>
      </div>
    </dl>
  );
}
