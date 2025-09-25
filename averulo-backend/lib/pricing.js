// lib/pricing.js

// NOTE: returns { ...feesJson, total } where the nested amounts are NGN (for UI)
// and `total` is in KOBO (for payments)!
const toKobo = (n) => Math.round(Number(n) * 100);

export function computePrice(nightlyPriceNGN, checkIn, checkOut) {
  const start = new Date(checkIn);
  const end   = new Date(checkOut);
  const nights = Math.round((end - start) / (1000 * 60 * 60 * 24));
  if (nights <= 0) {
    return { currency: "NGN", nights: 0, base: 0, cleaning: 0, service: 0, tax: 0, subtotal: 0, total: 0 };
  }

  const base     = nightlyPriceNGN * nights;
  const cleaning = 5000;                  // flat NGN
  const service  = Math.round(base * 0.10);   // 10% NGN
  const subtotal = base + cleaning + service;
  const tax      = Math.round(subtotal * 0.075); // 7.5% NGN
  const totalNGN = subtotal + tax;

  return {
    currency: "NGN",
    nights,
    base,
    cleaning,
    service,
    tax,
    subtotal,
    // KOBO for provider-facing total
    total: toKobo(totalNGN),
  };
}