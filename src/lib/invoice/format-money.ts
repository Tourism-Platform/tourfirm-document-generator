export function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatDate(value: string): string {
  const date = new Date(`${value}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatNumericDate(value: string): string {
  const date = new Date(`${value}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatDateRange(value: string): string {
  const parts = value.split(" – ");

  if (parts.length === 2) {
    return `${formatDate(parts[0] ?? "")} – ${formatDate(parts[1] ?? "")}`;
  }

  return formatDate(value);
}

export function formatInvoiceAmount(amount: number, currency: string): string {
  if (amount === 0) {
    return "–";
  }

  return formatMoney(amount, currency);
}
