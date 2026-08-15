import type { IInvoiceMetadata } from "@/types/invoice";

interface IInvoiceFooterProps {
  metadata: IInvoiceMetadata;
}

export function InvoiceFooter({ metadata }: IInvoiceFooterProps) {
  return (
    <footer className="invoice-footer">
      <section>
        <p className="invoice-section-label">Terms & conditions</p>
        <p className="invoice-footer-text">
          {metadata.terms ??
            "For a full refund, you must cancel at least 24 hours before the experience's start time."}
        </p>
      </section>
      <section>
        <p className="invoice-section-label">Notes</p>
        <p className="invoice-footer-text">{metadata.notes || "–"}</p>
      </section>
    </footer>
  );
}
