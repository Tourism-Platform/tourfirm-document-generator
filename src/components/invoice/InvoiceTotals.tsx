import { formatMoney } from "@/lib/invoice/format-money";
import type { IInvoiceTotals } from "@/types/invoice";

interface IInvoiceTotalsProps {
  totals: IInvoiceTotals;
  currency: string;
}

export function InvoiceTotals({ totals, currency }: IInvoiceTotalsProps) {
  return (
    <div className="invoice-summary">
      <div className="invoice-totals">
        <div className="invoice-totals-row">
          <span>Paid</span>
          <span>{formatMoney(totals.paid, currency)}</span>
        </div>
        <div className="invoice-totals-row">
          <span>Remaining</span>
          <span>{formatMoney(totals.remaining, currency)}</span>
        </div>
        <div className="invoice-totals-row total">
          <span>Total cost</span>
          <span>{formatMoney(totals.total, currency)}</span>
        </div>
      </div>
    </div>
  );
}
