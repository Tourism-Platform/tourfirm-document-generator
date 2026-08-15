import { formatInvoiceAmount } from "@/lib/invoice/format-money";
import type { IInvoiceItem } from "@/types/invoice";
import { InvoiceItemIcon } from "./InvoiceItemIcon";

interface IInvoiceItemsProps {
  items: IInvoiceItem[];
  currency: string;
}

export function InvoiceItems({ items, currency }: IInvoiceItemsProps) {
  return (
    <table className="invoice-items">
      <thead>
        <tr>
          <th className="col-no">No</th>
          <th>Item</th>
          <th className="numeric">Price</th>
        </tr>
      </thead>
      <tbody>
        {items.flatMap((item, index) => [
          <tr key={`item-${index}`}>
            <td className="col-no">{index + 1}</td>
            <td>
              <span className="invoice-item-label">
                <InvoiceItemIcon typ={item.typ} />
                {item.description}
              </span>
            </td>
            <td className="numeric">{formatInvoiceAmount(item.amount, currency)}</td>
          </tr>,
          ...(item.children ?? []).map((child, childIndex) => (
            <tr
              key={`item-${index}-child-${childIndex}`}
              className="invoice-item-child"
            >
              <td className="col-no" />
              <td>
                <span className="invoice-item-label is-child">
                  <InvoiceItemIcon typ={child.typ ?? item.typ} />
                  {child.description}
                </span>
              </td>
              <td className="numeric" />
            </tr>
          )),
        ])}
      </tbody>
    </table>
  );
}
