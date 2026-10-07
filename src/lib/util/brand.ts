// De merknaam staat al in de paginatitel-suffix en de site; in categorienamen is hij overbodig.

const BRAND_RE = /\bRC[\s-]?Choice\b/gi

/** Haalt "RC Choice" uit een categorienaam. Blijft er niets over, dan blijft de naam zoals hij is. */
export function stripBrand(name: string | null | undefined): string {
  const original = (name ?? "").trim()
  const cleaned = original
    .replace(BRAND_RE, " ")
    .replace(/\s+/g, " ")
    .replace(/^[\s|\-–—:,]+|[\s|\-–—:,]+$/g, "")
    .trim()
  return cleaned || original
}

/** "<titel> | RC Choice", zonder het merk dubbel te zetten als het al in de titel staat. */
export function titleWithBrand(title: string): string {
  const t = title.trim()
  return new RegExp(BRAND_RE.source, "i").test(t) ? t : `${t} | RC Choice`
}
