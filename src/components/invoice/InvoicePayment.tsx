import type { IInvoiceBooking, IInvoicePayment } from "@/types/invoice";
import { formatDateRange } from "@/lib/invoice/format-money";

interface IInvoicePaymentProps {
  booking?: IInvoiceBooking;
  payment: IInvoicePayment;
}

function InfoField({ label, value }: { label: string; value?: string | number }) {
  const display =
    value === undefined || value === "" || value === null ? "–" : String(value);

  return (
    <div className="invoice-info-field">
      <span className="invoice-info-label">{label}</span>
      <span className="invoice-info-value">{display}</span>
    </div>
  );
}

export function InvoicePayment({ booking, payment }: IInvoicePaymentProps) {
  return (
    <div className="invoice-info-grid">
      <section className="invoice-info-block">
        <p className="invoice-section-label">Booking</p>
        <InfoField label="Order number" value={booking?.orderNumber} />
        <InfoField label="Tour" value={booking?.tourName} />
        <InfoField label="Pax" value={booking?.pax} />
        <InfoField
          label="Dates"
          value={booking?.dates ? formatDateRange(booking.dates) : undefined}
        />
      </section>
      <section className="invoice-info-block">
        <p className="invoice-section-label">Payment details</p>
        {payment.method ? <InfoField label="Method" value={payment.method} /> : null}
        {(payment.lines ?? []).map((line) => (
          <InfoField key={`${line.label}-${line.value}`} label={line.label} value={line.value} />
        ))}
        {!payment.method && (payment.lines ?? []).length === 0 ? (
          <InfoField label="Details" value="–" />
        ) : null}
      </section>
    </div>
  );
}
