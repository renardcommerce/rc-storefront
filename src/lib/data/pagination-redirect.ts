import { redirect } from "next/navigation"

import { listProducts } from "@lib/data/products"
import {
  buildPageUrl,
  PRODUCTS_PER_PAGE,
  pageRedirectTarget,
  parsePageParam,
  SearchParamsInput,
} from "@lib/util/pagination"
import { retryOnce } from "@lib/util/retry-once"

/**
 * Controleert ?page= vóór het renderen, zodat de redirect een echte 307 is
 * (binnen een Suspense-grens zou het een meta-refresh worden):
 * - ongeldige waarde (0, negatief, tekst): naar pagina 1;
 * - pagina boven de laatste pagina: naar de laatste pagina.
 * Overige parameters (sortBy, q) blijven behouden. Geeft het paginanummer terug.
 */
export async function resolvePageOrRedirect({
  searchParams,
  basePath,
  countryCode,
  filters,
}: {
  searchParams: SearchParamsInput
  basePath: string
  countryCode: string
  filters: { collection_id?: string[]; category_id?: string[]; q?: string }
}): Promise<number> {
  const parsed = parsePageParam(searchParams.page)

  if (!parsed.valid) {
    redirect(buildPageUrl(basePath, searchParams, 1))
  }

  if (parsed.page === 1) return 1

  let target: number | null = null
  try {
    // limit=1: alleen het totaal is nodig
    const {
      response: { count },
    } = await retryOnce(() =>
      listProducts({
        pageParam: 1,
        countryCode,
        queryParams: { limit: 1, ...filters },
      })
    )
    target = pageRedirectTarget(parsed.page, count, PRODUCTS_PER_PAGE)
  } catch (error) {
    // Backend-storing: niet redirecten, de lijst toont zelf een foutmelding met knop.
    console.error("Paginacontrole mislukt:", error)
  }

  // buiten try/catch: redirect() gooit een speciale fout
  if (target !== null) {
    redirect(buildPageUrl(basePath, searchParams, target))
  }

  return parsed.page
}
