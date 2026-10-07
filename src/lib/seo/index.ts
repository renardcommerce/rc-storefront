import { Metadata } from "next"

import { getBaseURL } from "@lib/util/env"

/**
 * SEO-basis (title/meta per pagina, canonicals, BreadcrumbList, uitgebreide sitemap).
 * Standaard UIT: met NEXT_PUBLIC_SEO_ENABLED niet op "true" is de uitvoer ongewijzigd.
 * Staat los van NEXT_PUBLIC_SITE_INDEXABLE: staging blijft noindex + robots Disallow.
 */
export const SEO_ENABLED = process.env.NEXT_PUBLIC_SEO_ENABLED === "true"

const BRAND = "RC Choice"

/** Metadata-extra's alleen toepassen als de vlag aan staat; anders blijft `current` ongewijzigd. */
export function withSeo(current: Metadata, extra: () => Metadata): Metadata {
  return SEO_ENABLED ? { ...current, ...extra() } : current
}

/** Titel met merknaam en (vanaf pagina 2) paginanummer. */
export function seoTitle(title: string, page = 1): string {
  const suffix = page > 1 ? ` – pagina ${page}` : ""
  return `${title}${suffix} | ${BRAND}`
}

/** Canoniek pad: alleen ?page= (vanaf pagina 2); sortering en zoekterm horen er niet in. */
export function canonicalPath(pathname: string, page = 1): string {
  return page > 1 ? `${pathname}?page=${page}` : pathname
}

/** Tekst voor meta description: HTML eruit, spaties samenvoegen, max. 155 tekens. */
export function metaText(raw: string | null | undefined, fallback: string): string {
  const text = (raw || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
  const value = text || fallback
  return value.length > 155 ? `${value.slice(0, 152).trimEnd()}...` : value
}

export type Crumb = { name: string; path: string }

/** schema.org BreadcrumbList; `path` is relatief aan de basis-URL (bv. "/nl/store"). */
export function breadcrumbJsonLd(crumbs: Crumb[], baseUrl = getBaseURL()) {
  const base = baseUrl.replace(/\/$/, "")
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${base}${c.path}`,
    })),
  }
}

/** ?page= voor titel/canonical: positief geheel getal, anders pagina 1. */
export function seoPage(raw: string | string[] | undefined): number {
  if (typeof raw !== "string" || !/^[0-9]+$/.test(raw)) return 1
  const n = Number(raw)
  return Number.isSafeInteger(n) && n > 1 ? n : 1
}
