import type { IInvoiceParty } from "@/types/invoice";

interface IInvoicePartiesProps {
  seller: IInvoiceParty;
  customer: IInvoiceParty;
}

function PartyField({
  label,
  value,
}: {
  label: string;
  value?: string | string[];
}) {
  const display = Array.isArray(value)
    ? value.filter((line) => line.trim().length > 0).join(", ")
    : value?.trim();

  return (
    <div className="invoice-party-field">
      <span className="invoice-party-field-label">{label}</span>
      <span className="invoice-party-field-value">{display || "–"}</span>
    </div>
  );
}

function PartyBlock({ label, party }: { label: string; party: IInvoiceParty }) {
  return (
    <section className="invoice-party">
      <p className="invoice-section-label">{label}</p>
      <PartyField label="Company" value={party.name} />
      <PartyField label="Address" value={party.addressLines} />
      <PartyField label="Contact" value={party.contact} />
      <PartyField label="Email" value={party.email} />
      <PartyField label="Phone" value={party.phone} />
    </section>
  );
}

export function InvoiceParties({ seller, customer }: IInvoicePartiesProps) {
  return (
    <div className="invoice-parties">
      <PartyBlock label="Billed to" party={customer} />
      <PartyBlock label="Sender" party={seller} />
    </div>
  );
}
