// Gratis verzending vanaf dit winkelmandbedrag (incl. btw, na korting), in
// hoofdeenheden (EUR). Moet gelijk blijven aan de prijsregel van de shipping
// option in Medusa ("Standaard verzending (NL & BE)").
export const FREE_SHIPPING_THRESHOLD = 20

// Vaste tekst voor productpagina en footer.
export const FREE_SHIPPING_TEXT = `Gratis verzending vanaf € ${FREE_SHIPPING_THRESHOLD} (NL & BE)`

// Landen die in de checkout getoond worden, met NL-label.
export const CHECKOUT_COUNTRIES: Record<string, string> = {
  nl: "Nederland",
  be: "België",
}

const toCents = (amount: number) => Math.round(amount * 100)

/**
 * Voortgang richting gratis verzending, 0-100, in centen berekend. Is de
 * drempel niet gehaald dan blijft de waarde onder 100 (max. 95), zodat de balk
 * ook bij € 0,01 tekort niet "vol" oogt. Pas bij >= drempel is het 100.
 */
export function getFreeShippingProgress(itemTotal?: number | null) {
  const cents = Math.max(0, toCents(itemTotal ?? 0))
  const thresholdCents = toCents(FREE_SHIPPING_THRESHOLD)
  if (cents >= thresholdCents) {
    return 100
  }
  return Math.min(95, Math.floor((cents / thresholdCents) * 100))
}

/**
 * Bepaalt of het winkelmandbedrag (cart.item_total) gratis verzending geeft.
 * Rekent in centen om floating point-fouten (bijv. 19.999999) te vermijden.
 */
export function getFreeShippingStatus(itemTotal?: number | null) {
  const cents = toCents(itemTotal ?? 0)
  const thresholdCents = toCents(FREE_SHIPPING_THRESHOLD)
  const isFree = cents >= thresholdCents
  return {
    isFree,
    remaining: isFree ? 0 : (thresholdCents - cents) / 100,
  }
}

type TotalsInput = {
  total?: number | null
  item_total?: number | null
  original_item_total?: number | null
  shipping_total?: number | null
}

/**
 * Bedragen voor weergave, allemaal incl. btw en onderling sluitend:
 * subtotaal - korting + verzending = totaal.
 * Verzending en korting worden afgeleid uit total / item_total /
 * original_item_total, zodat ze niet afhangen van of een los veld excl. of
 * incl. btw is.
 */
export function getDisplayTotals(t: TotalsInput) {
  const round2 = (n: number) => Math.round(n * 100) / 100
  const hasItemTotals = t.item_total != null
  const item = t.item_total ?? 0
  const original = t.original_item_total ?? item
  const total = t.total ?? 0
  return {
    subtotal: original,
    discount: hasItemTotals ? Math.max(0, round2(original - item)) : 0,
    shipping:
      hasItemTotals && t.total != null
        ? Math.max(0, round2(total - item))
        : t.shipping_total ?? 0,
    total,
  }
}
