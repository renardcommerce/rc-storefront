export type SearchParamsInput = Record<string, string | string[] | undefined>

export type ParsedPage = {
  /** Altijd een geheel getal >= 1. */
  page: number
  /** false als de opgegeven waarde ongeldig was (0, negatief, tekst, lijst, ...). */
  valid: boolean
}

const MAX_PAGE = 1_000_000

/** Leest de ?page=-waarde. Alleen positieve gehele getallen zijn geldig, anders pagina 1. */
export function parsePageParam(raw: string | string[] | undefined): ParsedPage {
  if (raw === undefined) return { page: 1, valid: true }
  if (typeof raw !== "string" || !/^[0-9]+$/.test(raw)) {
    return { page: 1, valid: false }
  }
  const n = Number(raw)
  if (!Number.isSafeInteger(n) || n < 1 || n > MAX_PAGE) {
    return { page: 1, valid: false }
  }
  return { page: n, valid: true }
}

/** Laatste pagina; minimaal 1 (ook bij 0 resultaten). */
export function getLastPage(count: number, perPage: number): number {
  if (!Number.isFinite(count) || count <= 0 || perPage <= 0) return 1
  return Math.ceil(count / perPage)
}

/** Pagina boven de laatste pagina: geeft de pagina terug waar naartoe verwezen moet worden, anders null. */
export function pageRedirectTarget(page: number, count: number, perPage: number): number | null {
  const last = getLastPage(count, perPage)
  return page > last ? last : null
}

/** Bouwt een pad met querystring; alle overige parameters blijven behouden, pagina 1 krijgt geen ?page=. */
export function buildPageUrl(
  pathname: string,
  searchParams: SearchParamsInput,
  page: number
): string {
  const qs = new URLSearchParams()
  for (const [key, value] of Object.entries(searchParams)) {
    if (key === "page" || value === undefined) continue
    for (const v of Array.isArray(value) ? value : [value]) qs.append(key, v)
  }
  if (page > 1) qs.set("page", String(page))
  const s = qs.toString()
  return s ? `${pathname}?${s}` : pathname
}

/** Aantal producten per pagina in /store, categorie- en collectiepagina's. */
export const PRODUCTS_PER_PAGE = 12
