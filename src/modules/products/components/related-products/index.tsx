import { listProducts } from "@lib/data/products"
import { hasProductPhoto } from "@lib/util/product-photo"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import Product from "../product-preview"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  // Zelfde categorie, alleen producten met foto, huidig product uitgesloten.
  const categoryIds = (product.categories ?? []).map((c) => c.id)
  if (!categoryIds.length) {
    return null
  }

  const products = await listProducts({
    queryParams: {
      region_id: region.id,
      category_id: categoryIds,
      is_giftcard: false,
      limit: 20,
    },
    countryCode,
  }).then(({ response }) =>
    response.products
      .filter((p) => p.id !== product.id && hasProductPhoto(p))
      .slice(0, 4)
  )

  if (!products.length) {
    return null
  }

  return (
    <div className="product-page-constraint">
      <div className="mb-8 small:mb-10">
        <p className="eyebrow mb-2">Gerelateerde producten</p>
        <p className="text-2xl small:text-3xl font-semibold tracking-tight text-ink">
          Misschien ook interessant voor jou.
        </p>
      </div>

      <ul className="grid grid-cols-2 medium:grid-cols-4 gap-x-4 small:gap-x-6 gap-y-10">
        {products.map((product) => (
          <li key={product.id}>
            <Product region={region} product={product} />
          </li>
        ))}
      </ul>
    </div>
  )
}
