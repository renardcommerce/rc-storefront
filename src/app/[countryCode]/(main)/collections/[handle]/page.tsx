import { Metadata } from "next"
import { notFound } from "next/navigation"
import { resolvePageOrRedirect } from "@lib/data/pagination-redirect"
import { getCollectionByHandle } from "@lib/data/collections"
import { breadcrumbJsonLd, canonicalPath, seoPage, seoTitle, withSeo } from "@lib/seo"
import JsonLd from "@modules/seo/json-ld"
import { StoreCollection } from "@medusajs/types"
import CollectionTemplate from "@modules/collections/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

type Props = {
  params: Promise<{ handle: string; countryCode: string }>
  searchParams: Promise<{
    page?: string
    sortBy?: SortOptions
  }>
}

export const PRODUCT_LIMIT = 12
export const dynamic = "force-dynamic"

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const searchParams = await props.searchParams
  const collection = await getCollectionByHandle(params.handle)

  if (!collection) {
    notFound()
  }

  const current: Metadata = {
    title: `${collection.title} | RC Choice`,
    description: `${collection.title} | RC Choice`,
  }

  return withSeo(current, () => {
    const page = seoPage(searchParams.page)
    return {
      title: seoTitle(collection.title, page),
      description: `Bekijk de collectie ${collection.title} van RC Choice.`,
      alternates: {
        canonical: canonicalPath(
          `/${params.countryCode}/collections/${params.handle}`,
          page
        ),
      },
    }
  })
}

export default async function CollectionPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy } = searchParams

  const collection = await getCollectionByHandle(params.handle).then(
    (collection: StoreCollection) => collection
  )

  if (!collection) {
    notFound()
  }

  const page = await resolvePageOrRedirect({
    searchParams,
    basePath: `/${params.countryCode}/collections/${params.handle}`,
    countryCode: params.countryCode,
    filters: { collection_id: [collection.id] },
  })

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: `/${params.countryCode}` },
          {
            name: collection.title,
            path: `/${params.countryCode}/collections/${params.handle}`,
          },
        ])}
      />
      <CollectionTemplate
        collection={collection}
        page={String(page)}
        sortBy={sortBy}
        countryCode={params.countryCode}
      />
    </>
  )
}
