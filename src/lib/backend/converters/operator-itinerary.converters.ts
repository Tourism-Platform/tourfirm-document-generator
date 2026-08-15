import type { IBackendItineraryResponse } from "@/lib/backend/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function minMaxToMoney(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number.parseFloat(value.replace(/^\+/, "").trim());
    return Number.isFinite(parsed) ? parsed : 0;
  }

  if (!isRecord(value)) {
    return 0;
  }

  const min = isRecord(value.min) ? value.min : undefined;
  const val = min?.val;

  return typeof val === "number" && Number.isFinite(val) ? val : 0;
}

function mapDetails(value: unknown): Array<{ name?: string | null; typ?: string }> {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((entry) => {
    if (!isRecord(entry)) {
      return [];
    }

    const name = asString(entry.name);

    if (!name) {
      return [];
    }

    return [
      {
        name,
        typ: asString(entry.typ),
      },
    ];
  });
}

export function mapOperatorItineraryToBackend(
  payload: unknown,
): IBackendItineraryResponse | null {
  if (!isRecord(payload)) {
    return null;
  }

  const bookingId = asString(payload.booking_id);
  const orderNumber = asString(payload.order_number);

  if (!bookingId || !orderNumber) {
    return null;
  }

  const events: IBackendItineraryResponse["events"] = [];

  for (const rawEvent of Array.isArray(payload.events) ? payload.events : []) {
    if (!isRecord(rawEvent)) {
      continue;
    }

    const inner = isRecord(rawEvent.event) ? rawEvent.event : rawEvent;
    const name = asString(inner.name) ?? asString(inner.title);
    const details = mapDetails(inner.details);

    if (!name && details.length === 0) {
      continue;
    }

    events.push({
      name: name ?? null,
      typ: asString(inner.typ) ?? asString(rawEvent.typ),
      day: asNumber(inner.day) ?? null,
      position: asNumber(inner.position) ?? null,
      cost: minMaxToMoney(rawEvent.cost),
      markup: minMaxToMoney(rawEvent.markup),
      fees: minMaxToMoney(rawEvent.fees),
      details,
    });
  }

  for (const rawPackage of Array.isArray(payload.packages) ? payload.packages : []) {
    if (!isRecord(rawPackage)) {
      continue;
    }

    const name = asString(rawPackage.name);

    if (!name) {
      continue;
    }

    events.push({
      name,
      typ: "package",
      cost: minMaxToMoney(rawPackage.cost),
      markup: minMaxToMoney(rawPackage.markup),
      fees: minMaxToMoney(rawPackage.fees),
    });
  }

  return {
    booking_id: bookingId,
    order_number: orderNumber,
    display_lang: asString(payload.display_lang),
    events,
  };
}
