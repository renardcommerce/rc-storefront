// Retourvenster en retournummer. Pure functies (getest in returns.test.ts).

/** Aantal dagen na levering waarin een retour kan worden aangemeld. Hier aanpassen. */
export const RETURN_WINDOW_DAYS = 14

const DAY_MS = 24 * 60 * 60 * 1000

const startOfUtcDay = (d: Date) =>
  Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())

/**
 * Laatste dag waarop een retour kan worden aangemeld: leverdag + RETURN_WINDOW_DAYS
 * (kalenderdagen, UTC). De leverdag zelf is dag 0.
 */
export function returnDeadline(
  deliveredAt: Date,
  windowDays: number = RETURN_WINDOW_DAYS
): Date {
  return new Date(startOfUtcDay(deliveredAt) + windowDays * DAY_MS)
}

/** true als `now` op of na de leverdag valt en uiterlijk op de laatste dag van het venster. */
export function isWithinReturnWindow(
  deliveredAt: Date | string | null | undefined,
  now: Date = new Date(),
  windowDays: number = RETURN_WINDOW_DAYS
): boolean {
  if (!deliveredAt) return false
  const delivered = new Date(deliveredAt)
  if (Number.isNaN(delivered.getTime())) return false
  const days = Math.round((startOfUtcDay(now) - startOfUtcDay(delivered)) / DAY_MS)
  return days >= 0 && days <= windowDays
}

/** Retournummer: RC-RET-<bestelnummer>-<n>, met n >= 1 (n-de retour op die bestelling). */
export function returnNumber(displayId: number | string, n: number = 1): string {
  const id = String(displayId).trim()
  if (!/^[0-9A-Za-z]+$/.test(id)) {
    throw new Error("Ongeldig bestelnummer")
  }
  if (!Number.isInteger(n) || n < 1) {
    throw new Error("Ongeldig volgnummer")
  }
  return `RC-RET-${id}-${n}`
}
