"use server"

import { sdk } from "@lib/config"
import { sortProducts } from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams
  countryCode?: string
  regionId?: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams
}> => {
  if (!countryCode && !regionId) {
    throw new Error("Landcode of regio-ID is verplicht")
  }

  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit

  let region: HttpTypes.StoreRegion | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = await retrieveRegion(regionId!)
  }

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    revalidate: 300,
    ...(await getCacheOptions("products")),
  }

  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
      `/store/products`,
      {
        method: "GET",
        query: {
          limit,
          offset,
          region_id: region?.id,
          fields:
            "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,",
          ...queryParams,
        },
        headers,
        next,
        cache: "force-cache",
      }
    )
    .then(({ products, count }) => {
      const nextPage = count > offset + limit ? pageParam + 1 : null

      return {
        response: {
          products,
          count,
        },
        nextPage: nextPage,
        queryParams,
      }
    })
}

const API_PAGE_SIZE = 100

/**
 * Productlijst met sortering + paginering.
 *
 * - "Nieuwste eerst": de API sorteert en pagineert zelf (order=-created_at,
 *   offset/limit), dus één kleine request per pagina, ongeacht de catalogus.
 * - Prijssortering: de store-API kan niet op berekende prijs sorteren. Daarom
 *   worden alle producten opgehaald (pagina's van 100, de rest parallel),
 *   in het geheugen gesorteerd en daarna gepagineerd. De requests zitten in de
 *   Next-fetchcache (5 min), dus alleen de eerste bezoeker na verversen merkt
 *   de extra requests.
 */
export const listProductsWithSort = async ({
  page = 1,
  queryParams,
  sortBy = "created_at",
  countryCode,
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  sortBy?: SortOptions
  countryCode: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  const limit = queryParams?.limit || 12
  const safePage = Math.max(page, 1)

  if (sortBy === "created_at") {
    const {
      response: { products, count },
    } = await listProducts({
      pageParam: safePage,
      queryParams: { ...queryParams, limit, order: "-created_at" },
      countryCode,
    })

    return {
      response: { products, count },
      nextPage: count > safePage * limit ? safePage + 1 : null,
      queryParams,
    }
  }

  const fetchPage = (pageParam: number) =>
    listProducts({
      pageParam,
      // vaste volgorde, zodat producten met dezelfde prijs stabiel blijven
      queryParams: { ...queryParams, limit: API_PAGE_SIZE, order: "-created_at" },
      countryCode,
    })

  const first = await fetchPage(1)
  const total = first.response.count
  const extraPages = Math.max(0, Math.ceil(total / API_PAGE_SIZE) - 1)
  const rest = await Promise.all(
    Array.from({ length: extraPages }, (_, i) => fetchPage(i + 2))
  )

  const all = [first, ...rest].flatMap((r) => r.response.products)
  const sorted = sortProducts(all, sortBy)

  const start = (safePage - 1) * limit

  return {
    response: {
      products: sorted.slice(start, start + limit),
      count: total,
    },
    nextPage: total > start + limit ? safePage + 1 : null,
    queryParams,
  }
}
