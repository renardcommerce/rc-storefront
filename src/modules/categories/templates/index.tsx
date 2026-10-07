import { notFound } from "next/navigation"
import { Suspense } from "react"

import { stripBrand } from "@lib/util/brand"
import PageHeader from "@modules/store/components/page-header"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

export default function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)

  return (
    <div className="content-container py-8 small:py-12" data-testid="category-container">
      <PageHeader
        eyebrow={parents.length ? parents.map((p) => p.name).join(" / ") : "Categorie"}
        title={stripBrand(category.name)}
        titleTestId="category-page-title"
      >
        {category.description && (
          <p className="mt-3 max-w-2xl text-base text-grey-70">
            {category.description}
          </p>
        )}
      </PageHeader>
      {category.category_children && category.category_children.length > 0 && (
        <ul className="mb-6 flex flex-wrap gap-2 small:mb-8">
          {category.category_children.map((c) => (
            <li key={c.id}>
              <LocalizedClientLink
                href={`/categories/${c.handle}`}
                className="inline-flex h-10 items-center rounded-circle bg-bone px-4 text-sm text-ink hover:bg-grey-20"
              >
                {c.name}
              </LocalizedClientLink>
            </li>
          ))}
        </ul>
      )}
      <RefinementList sortBy={sort} data-testid="sort-by-container" />
      <Suspense
          fallback={
            <SkeletonProductGrid
              numberOfProducts={category.products?.length ?? 8}
            />
          }
        >
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            categoryId={category.id}
            countryCode={countryCode}
          />
      </Suspense>
    </div>
  )
}
