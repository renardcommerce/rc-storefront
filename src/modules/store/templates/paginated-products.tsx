import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { PRODUCTS_PER_PAGE } from "@lib/util/pagination"
import { retryOnce } from "@lib/util/retry-once"
import ProductPreview from "@modules/products/components/product-preview"
import RetryButton from "@modules/store/components/retry-button"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

const PRODUCT_LIMIT = PRODUCTS_PER_PAGE

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  q?: string
  order?: string
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  q,
  countryCode,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  q?: string
  countryCode: string
}) {
  const queryParams: PaginatedProductsParams = {
    limit: PRODUCTS_PER_PAGE,
  }

  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = [categoryId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (q) {
    queryParams["q"] = q
  }

  let region
  let products
  let count

  try {
    // één nieuwe poging bij 502/503/504 of netwerkfout
    region = await retryOnce(() => getRegion(countryCode))

    if (!region) {
      return null
    }

    const {
      response: { products: list, count: total },
    } = await retryOnce(() =>
      listProductsWithSort({ page, queryParams, sortBy, countryCode })
    )
    products = list
    count = total
  } catch (error) {
    console.error("Producten ophalen mislukt na 2 pogingen:", error)
    return (
      <div
        className="rounded-large border border-grey-20 p-6 small:p-8"
        role="alert"
        data-testid="products-error"
      >
        <p className="font-semibold text-ink">
          De producten konden niet worden geladen.
        </p>
        <p className="mt-1 text-grey-60">
          Er is tijdelijk een storing. Probeer het zo nog eens.
        </p>
        <RetryButton />
      </div>
    )
  }

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  if (q && !products.length) {
    return (
      <p className="text-grey-60" data-testid="no-results">
        Geen producten gevonden voor “{q}”. Probeer een andere zoekterm.
      </p>
    )
  }

  return (
    <>
      <p className="mb-6 text-sm text-grey-60" data-testid="product-count">
        {count} {count === 1 ? "product" : "producten"}
      </p>
      <ul
        className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-4 small:gap-x-6 gap-y-10"
        data-testid="products-list"
      >
        {products.map((p) => {
          return (
            <li key={p.id}>
              <ProductPreview product={p} region={region} />
            </li>
          )
        })}
      </ul>
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}
