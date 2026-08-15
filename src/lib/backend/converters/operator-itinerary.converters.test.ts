import { describe, expect, it } from "vitest";
import { mapOperatorItineraryToBackend } from "./operator-itinerary.converters";

describe("mapOperatorItineraryToBackend", () => {
  it("maps nested operator events, details and package lines", () => {
    const mapped = mapOperatorItineraryToBackend({
      booking_id: "booking-1",
      order_number: "ORD-1",
      display_lang: "en",
      events: [
        {
          event: {
            typ: "flight",
            name: "Flight Tashkent — Samarkand",
            day: 1,
            position: 1,
          },
          cost: { min: { val: 180, currency: "USD" }, max: { val: 180, currency: "USD" } },
          markup: { min: { val: 20, currency: "USD" }, max: { val: 20, currency: "USD" } },
          fees: { min: { val: 0, currency: "USD" }, max: { val: 0, currency: "USD" } },
        },
        {
          event: {
            typ: "options",
            name: "Hotel options",
            details: [
              { typ: "housing", name: "Hilton Lisbon" },
              { typ: "housing", name: "Pestana Palace" },
            ],
          },
          cost: { min: { val: 0, currency: "USD" }, max: { val: 0, currency: "USD" } },
          markup: { min: { val: 0, currency: "USD" }, max: { val: 0, currency: "USD" } },
          fees: { min: { val: 0, currency: "USD" }, max: { val: 0, currency: "USD" } },
        },
      ],
      packages: [
        {
          name: "Full board",
          cost: { min: { val: 100, currency: "USD" }, max: { val: 100, currency: "USD" } },
          markup: { min: { val: 10, currency: "USD" }, max: { val: 10, currency: "USD" } },
          fees: { min: { val: 5, currency: "USD" }, max: { val: 5, currency: "USD" } },
        },
      ],
    });

    expect(mapped).toEqual({
      booking_id: "booking-1",
      order_number: "ORD-1",
      display_lang: "en",
      events: [
        {
          name: "Flight Tashkent — Samarkand",
          typ: "flight",
          day: 1,
          position: 1,
          cost: 180,
          markup: 20,
          fees: 0,
          details: [],
        },
        {
          name: "Hotel options",
          typ: "options",
          day: null,
          position: null,
          cost: 0,
          markup: 0,
          fees: 0,
          details: [
            { name: "Hilton Lisbon", typ: "housing" },
            { name: "Pestana Palace", typ: "housing" },
          ],
        },
        {
          name: "Full board",
          typ: "package",
          cost: 100,
          markup: 10,
          fees: 5,
        },
      ],
    });
  });

  it("returns null when booking identifiers are missing", () => {
    expect(mapOperatorItineraryToBackend({ events: [] })).toBeNull();
  });
});
