import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function FeaturedGrid({
  region,
}: {
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      limit: 12,
      order: "-created_at",
      fields: "*variants.calculated_price",
    },
  })

  // Voorkeur voor producten met foto; vul aan als er te weinig zijn.
  const withPhoto = products.filter((p) => p.thumbnail || p.images?.length)
  const without = products.filter((p) => !(p.thumbnail || p.images?.length))
  const picked = [...withPhoto, ...without].slice(0, 4)

  if (!picked.length) {
    return null
  }

  return (
    <section className="bg-paper">
      <div className="content-container pt-4 pb-16 small:pb-24">
        <div className="flex items-end justify-between gap-4 mb-8 small:mb-10">
          <div>
            <p className="eyebrow mb-2">Assortiment</p>
            <h2 className="text-2xl small:text-4xl font-semibold tracking-tight text-ink">
              Uit ons assortiment
            </h2>
          </div>
          <LocalizedClientLink
            href="/store"
            className="shrink-0 whitespace-nowrap text-sm font-semibold text-ink underline underline-offset-4 hover:text-grey-60"
          >
            Bekijk alles
          </LocalizedClientLink>
        </div>
        <ul className="grid grid-cols-2 small:grid-cols-4 gap-x-4 small:gap-x-6 gap-y-10">
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
