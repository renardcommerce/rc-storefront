import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

interface MinPricedProduct extends HttpTypes.StoreProduct {
  _minPrice?: number
}

const time = (p: HttpTypes.StoreProduct) =>
  p.created_at ? new Date(p.created_at).getTime() || 0 : 0

// Vaste volgorde bij gelijke sleutel: nieuwste eerst, daarna op id. Zo hangt de
// volgorde (en dus welke producten op welke pagina staan) niet af van de volgorde
// waarin de API ze toevallig teruggeeft.
const tieBreak = (a: HttpTypes.StoreProduct, b: HttpTypes.StoreProduct) =>
  time(b) - time(a) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)

/**
 * Helper function to sort products by price until the store API supports sorting by price
 * @param products
 * @param sortBy
 * @returns products sorted by price
 */
export function sortProducts(
  products: HttpTypes.StoreProduct[],
  sortBy: SortOptions
): HttpTypes.StoreProduct[] {
  let sortedProducts = products as MinPricedProduct[]

  if (["price_asc", "price_desc"].includes(sortBy)) {
    // Precompute the minimum price for each product
    sortedProducts.forEach((product) => {
      if (product.variants && product.variants.length > 0) {
        product._minPrice = Math.min(
          ...product.variants.map(
            (variant) => variant?.calculated_price?.calculated_amount || 0
          )
        )
      } else {
        product._minPrice = Infinity
      }
    })

    // Sort products based on the precomputed minimum prices
    sortedProducts.sort((a, b) => {
      const pa = a._minPrice!
      const pb = b._minPrice!
      // Infinity - Infinity is NaN; gelijke prijzen vallen terug op tieBreak
      const diff = pa === pb ? 0 : pa < pb ? -1 : 1
      return (sortBy === "price_asc" ? diff : -diff) || tieBreak(a, b)
    })
  }

  if (sortBy === "created_at") {
    sortedProducts.sort(tieBreak)
  }

  return sortedProducts
}
