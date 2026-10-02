// Staffelkorting: alleen weergave. De echte korting wordt apart in Medusa
// ingesteld; deze tabel raakt prijs- of winkelwagenlogica niet.
// Standaard verborgen; zet NEXT_PUBLIC_SHOW_TIER_DISCOUNT=true om te tonen
// zodra de korting in Medusa live staat.
export const SHOW_TIER_DISCOUNT =
  process.env.NEXT_PUBLIC_SHOW_TIER_DISCOUNT === "true"

export const TIER_DISCOUNTS = [
  { quantity: 2, percentage: 4 },
  { quantity: 4, percentage: 8 },
  { quantity: 8, percentage: 12 },
] as const
