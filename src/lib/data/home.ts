import { listCollections } from "@lib/data/collections"
import { listProducts } from "@lib/data/products"
import { hasProductPhoto } from "@lib/util/product-photo"
import { HttpTypes } from "@medusajs/types"

const POPULAR_COLLECTION_HANDLE = "populair"
const FIELDS = "*variants.calculated_price,*images"

/**
 * Producten voor hero en Populair-rij. Alleen producten met foto.
 *
 * Er is geen verkoopdata in de shop. Daarom: staat er in Medusa een collectie
 * met handle "populair", dan komen die producten (handmatig gekozen). Anders
 * de nieuwste producten met foto.
 */
export async function listHomeProducts(
  region: HttpTypes.StoreRegion
): Promise<{ products: HttpTypes.StoreProduct[]; curated: boolean }> {
  const collection = await listCollections({ handle: POPULAR_COLLECTION_HANDLE })
    .then(({ collections }) => collections[0])
    .catch(() => undefined)

  if (collection) {
    const { response } = await listProducts({
      regionId: region.id,
      queryParams: { collection_id: [collection.id], limit: 12, fields: FIELDS },
    }).catch(() => ({ response: { products: [] as HttpTypes.StoreProduct[] } }))
    const curated = response.products.filter(hasProductPhoto)
    if (curated.length >= 4) {
      return { products: curated, curated: true }
    }
  }

  const { response } = await listProducts({
    regionId: region.id,
    queryParams: { limit: 24, order: "-created_at", fields: FIELDS },
  })
  return { products: response.products.filter(hasProductPhoto), curated: false }
}
