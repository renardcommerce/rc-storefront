import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"

// products: alleen producten met foto (zie listHomeProducts).
export default function Popular({
  products,
  region,
}: {
  products: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion
}) {
  const picked = products.slice(0, 8)

  if (picked.length < 4) {
    return null
  }

  return (
    <section className="bg-paper" data-testid="home-popular">
      <div className="content-container pb-16 pt-4 small:pb-24">
        <div className="mb-8 flex items-end justify-between gap-4 small:mb-10">
          <div>
            <p className="eyebrow mb-2">Assortiment</p>
            <h2 className="text-2xl font-semibold tracking-tight text-ink small:text-4xl">
              Populair
            </h2>
          </div>
          <LocalizedClientLink
            href="/store"
            className="shrink-0 whitespace-nowrap text-sm font-semibold text-ink underline underline-offset-4 hover:text-grey-60"
          >
            Bekijk alles
          </LocalizedClientLink>
        </div>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 small:grid-cols-4 small:gap-x-6">
          {picked.map((product) => (
            <li key={product.id}>
              <ProductPreview product={product} region={region} isFeatured />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
