import { Metadata } from "next"
import { notFound } from "next/navigation"
import { resolvePageOrRedirect } from "@lib/data/pagination-redirect"
import { getCollectionByHandle } from "@lib/data/collections"
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
  const collection = await getCollectionByHandle(params.handle)

  if (!collection) {
    notFound()
  }

  return {
    title: `${collection.title} | RC Choice`,
    description: `${collection.title} | RC Choice`,
  }
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
    <CollectionTemplate
      collection={collection}
      page={String(page)}
      sortBy={sortBy}
      countryCode={params.countryCode}
    />
  )
}
