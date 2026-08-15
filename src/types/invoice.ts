export interface IInvoiceDocument {
  number: string;
  issuedAt: string;
  dueAt?: string;
  currency: string;
}

export interface IInvoiceParty {
  name: string;
  addressLines: string[];
  contact?: string;
  email?: string;
  phone?: string;
  taxId?: string;
}

export interface IInvoiceItemChild {
  description: string;
  typ?: string;
}

export interface IInvoiceItem {
  description: string;
  typ?: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  children?: IInvoiceItemChild[];
}

export interface IInvoiceTotals {
  subtotal: number;
  tax: number;
  discount: number;
  paid: number;
  remaining: number;
  total: number;
}

export interface IInvoicePaymentLine {
  label: string;
  value: string;
}

export interface IInvoicePayment {
  status: string;
  method?: string;
  dueAt?: string;
  lines?: IInvoicePaymentLine[];
}

export interface IInvoiceBooking {
  orderNumber: string;
  tourName: string;
  pax: number;
  dates: string;
}

export interface IInvoiceBrand {
  name: string;
}

export interface IInvoiceMetadata {
  notes?: string;
  terms?: string;
  locale?: string;
}

export interface IInvoiceDocumentData {
  document: IInvoiceDocument;
  brand: IInvoiceBrand;
  seller: IInvoiceParty;
  customer: IInvoiceParty;
  booking?: IInvoiceBooking;
  items: IInvoiceItem[];
  totals: IInvoiceTotals;
  payment: IInvoicePayment;
  metadata: IInvoiceMetadata;
}
