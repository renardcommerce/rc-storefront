import { Cable, LucideIcon, Network, Usb } from "lucide-react"

import { listCategories } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const pickIcon = (name: string): LucideIcon => {
  const n = name.toLowerCase()
  if (n.includes("usb")) return Usb
  if (n.includes("netwerk")) return Network
  return Cable
}

// Eigen id plus alle onderliggende categorieën, zodat producten in een
// subcategorie ook meetellen.
const collectIds = (c: HttpTypes.StoreProductCategory): string[] => [
  c.id,
  ...(c.category_children ?? []).flatMap((child) =>
    collectIds(child as HttpTypes.StoreProductCategory)
  ),
]

export default async function Categories({
  region,
}: {
  region: HttpTypes.StoreRegion
}) {
  const all = await listCategories()
  const top = (all ?? []).filter((c) => !c.parent_category)

  if (!top.length) {
    return null
  }

  const counts = await Promise.all(
    top.map((c) =>
      listProducts({
        regionId: region.id,
        queryParams: { category_id: collectIds(c), limit: 1, fields: "id" },
      })
        .then(({ response }) => response.count)
        .catch(() => null)
    )
  )

  return (
    <section className="bg-paper">
      <div className="content-container py-12 small:py-20">
        <p className="eyebrow mb-2">Categorieën</p>
        <h2 className="text-2xl small:text-4xl font-semibold tracking-tight text-ink mb-8 small:mb-10">
          Shop op categorie
        </h2>
        <ul className="grid grid-cols-1 small:grid-cols-3 gap-4 small:gap-6">
          {top.map((category, i) => {
            const Icon = pickIcon(category.name)
            const count = counts[i]
            return (
              <li key={category.id}>
                <LocalizedClientLink
                  href={`/categories/${category.handle}`}
                  className="group flex h-full flex-col gap-4 rounded-large bg-white p-6 small:p-8 shadow-card hover:shadow-card-hover transition-shadow duration-200"
                  data-testid="home-category"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-circle bg-bone">
                    <Icon size={24} className="text-ink" aria-hidden="true" />
                  </span>
                  <span className="text-xl font-semibold text-ink">
                    {category.name}
                  </span>
                  {count !== null && (
                    <span className="text-sm text-grey-60">
                      {count} {count === 1 ? "product" : "producten"}
                    </span>
                  )}
                  <span className="mt-auto text-sm font-semibold text-ink underline-offset-4 group-hover:underline">
                    Bekijk categorie
                  </span>
                </LocalizedClientLink>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
