import { Metadata } from "next"
import { notFound } from "next/navigation"

import { resolvePageOrRedirect } from "@lib/data/pagination-redirect"
import { getCategoryByHandle, listCategories } from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"
import {
  breadcrumbJsonLd,
  canonicalPath,
  metaText,
  seoPage,
  seoTitle,
  withSeo,
} from "@lib/seo"
import JsonLd from "@modules/seo/json-ld"
import { StoreRegion } from "@medusajs/types"
import CategoryTemplate from "@modules/categories/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

export async function generateStaticParams() {
  try {
    const product_categories = await listCategories()
    if (!product_categories) {
      return []
    }
    const countryCodes = await listRegions().then((regions: StoreRegion[]) =>
      regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    )
    const categoryHandles = product_categories.map(
      (category: any) => category.handle
    )
    const staticParams = countryCodes
      ?.map((countryCode: string | undefined) =>
        categoryHandles.map((handle: any) => ({
          countryCode,
          category: [handle],
        }))
      )
      .flat()
    return staticParams
  } catch (error) {
    return []
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const searchParams = await props.searchParams
  try {
    const productCategory = await getCategoryByHandle(params.category)

    const title = productCategory.name + " | RC Choice"

    const description = productCategory.description ?? `${title} category.`

    const current: Metadata = {
      title,
      description,
      alternates: {
        canonical: `${params.category.join("/")}`,
      },
    }

    return withSeo(current, () => ({
      title: seoTitle(productCategory.name, seoPage(searchParams.page)),
      description: metaText(
        productCategory.description,
        `Bekijk ${productCategory.name} van RC Choice.`
      ),
      alternates: {
        canonical: canonicalPath(
          `/${params.countryCode}/categories/${params.category.join("/")}`,
          seoPage(searchParams.page)
        ),
      },
    }))
  } catch (error) {
    notFound()
  }
}

export default async function CategoryPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy } = searchParams

  const productCategory = await getCategoryByHandle(params.category)

  if (!productCategory) {
    notFound()
  }

  const page = await resolvePageOrRedirect({
    searchParams,
    basePath: `/${params.countryCode}/categories/${params.category.join("/")}`,
    countryCode: params.countryCode,
    filters: { category_id: [productCategory.id] },
  })

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: `/${params.countryCode}` },
          {
            name: productCategory.name,
            path: `/${params.countryCode}/categories/${params.category.join("/")}`,
          },
        ])}
      />
      <CategoryTemplate
        category={productCategory}
        sortBy={sortBy}
        page={String(page)}
        countryCode={params.countryCode}
      />
    </>
  )
}
