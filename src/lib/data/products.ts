"use server"

import { sdk } from "@lib/config"
import { fetchAllUnique, paginate } from "@lib/util/fetch-all"
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
            "*variants.calculated_price,+variants.inventory_quantity,*variants.images,*images,+metadata,+tags,*categories,",
          ...queryParams,
        },
        headers,
        next,
        cache: "force-cache",
        // Time-out, en schakelt bovendien Next's request-memoization uit: anders
        // krijgt een nieuwe poging binnen dezelfde render de mislukte response terug.
        signal: AbortSignal.timeout(10_000),
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
 * De store-API pagineert met offset en kan niet op berekende prijs sorteren. Pagineren met
 * offset op "-created_at" gaf bovendien dubbele en ontbrekende producten: veel producten hebben
 * dezelfde created_at, dus de volgorde kan per verzoek verschillen. Daarom worden voor elke
 * sortering alle producten van de lijst in één keer opgehaald (pagina's van 100, de rest
 * parallel, 5 min in de Next-fetchcache), op id ontdubbeld, deterministisch gesorteerd
 * (zie sortProducts: created_at aflopend, dan id) en daarna lokaal gepagineerd.
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

  const { products, count, complete } = await fetchAllUnique<HttpTypes.StoreProduct>(
    async (offset, size) => {
      const { response } = await listProducts({
        pageParam: Math.floor(offset / size) + 1,
        // vaste volgorde, zodat producten met dezelfde prijs stabiel blijven
        queryParams: { ...queryParams, limit: size, order: "-created_at" },
        countryCode,
      })
      return { products: response.products, count: response.count }
    },
    API_PAGE_SIZE
  )

  if (!complete) {
    console.warn(
      `Productlijst onvolledig: ${products.length} van ${count} producten opgehaald`
    )
  }

  const sorted = sortProducts(products, sortBy)
  const start = (safePage - 1) * limit

  return {
    response: {
      products: paginate(sorted, safePage, limit),
      count,
    },
    nextPage: count > start + limit ? safePage + 1 : null,
    queryParams,
  }
}
