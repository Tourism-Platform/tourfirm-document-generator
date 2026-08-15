import { formatNumericDate } from "@/lib/invoice/format-money";
import type { IInvoiceDocumentData } from "@/types/invoice";

interface IInvoiceHeaderProps {
  data: IInvoiceDocumentData;
}

export function InvoiceHeader({ data }: IInvoiceHeaderProps) {
  const initial = data.brand.name.trim().charAt(0).toUpperCase() || "A";

  return (
    <header className="invoice-header">
      <div className="invoice-brand">
        <span className="invoice-monogram" aria-hidden="true">
          {initial}
        </span>
        <h1 className="invoice-brand-name">{data.brand.name}</h1>
      </div>
      <dl className="invoice-header-meta">
        <div>
          <dt>Invoice No</dt>
          <dd>{data.document.number}</dd>
        </div>
        <div>
          <dt>Issue date</dt>
          <dd>{formatNumericDate(data.document.issuedAt)}</dd>
        </div>
      </dl>
    </header>
  );
}
