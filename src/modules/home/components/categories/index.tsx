import Image from "next/image"
import { ArrowRight } from "lucide-react"

import { listCategories } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import { getProductPhoto, hasProductPhoto } from "@lib/util/product-photo"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

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

  // Per categorie: aantal producten en een echte productfoto (eerste product
  // met foto). Zonder foto toont de tegel geen beeld, nooit een verzonnen foto.
  const info = await Promise.all(
    top.map((c) =>
      listProducts({
        regionId: region.id,
        queryParams: {
          category_id: collectIds(c),
          limit: 12,
          order: "-created_at",
          fields: "id,title,thumbnail,*images",
        },
      })
        .then(({ response }) => ({
          count: response.count as number | null,
          photo: (() => {
            const withPhoto = response.products.find(hasProductPhoto)
            return withPhoto ? getProductPhoto(withPhoto) : null
          })(),
        }))
        .catch(() => ({ count: null, photo: null }))
    )
  )

  return (
    <section className="bg-paper">
      <div className="content-container py-12 small:py-20">
        <p className="eyebrow mb-2">Categorieën</p>
        <h2 className="mb-8 text-2xl font-semibold tracking-tight text-ink small:mb-10 small:text-4xl">
          Shop op categorie
        </h2>
        <ul className="grid grid-cols-1 gap-4 xsmall:grid-cols-2 small:grid-cols-3 small:gap-6">
          {top.map((category, i) => {
            const { count, photo } = info[i]
            return (
              <li key={category.id}>
                <LocalizedClientLink
                  href={`/categories/${category.handle}`}
                  className="group flex h-full flex-col overflow-hidden rounded-large bg-white shadow-card transition-shadow duration-200 hover:shadow-card-hover"
                  data-testid="home-category"
                >
                  <div className="relative aspect-[4/3] w-full bg-bone">
                    {photo && (
                      <Image
                        src={photo}
                        alt=""
                        fill
                        quality={60}
                        sizes="(max-width: 512px) 90vw, (max-width: 1024px) 45vw, 460px"
                        className="object-contain object-center p-8 mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="flex items-end justify-between gap-4 bg-ink p-5 text-paper small:p-6">
                    <div className="min-w-0">
                      <span className="block text-lg font-semibold small:text-xl">
                        {category.name}
                      </span>
                      {count !== null && (
                        <span className="mt-1 block text-sm text-grey-20">
                          {count} {count === 1 ? "product" : "producten"}
                        </span>
                      )}
                    </div>
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-circle bg-gold text-ink"
                      aria-hidden="true"
                    >
                      <ArrowRight size={18} />
                    </span>
                  </div>
                </LocalizedClientLink>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
