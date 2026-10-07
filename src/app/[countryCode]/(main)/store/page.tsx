import { Metadata } from "next"

import { resolvePageOrRedirect } from "@lib/data/pagination-redirect"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

export const metadata: Metadata = {
  title: "Alle producten",
  description: "Bekijk alle RC Choice producten.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    q?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { sortBy } = searchParams
  const q = searchParams.q?.trim().slice(0, 100) || undefined

  const page = await resolvePageOrRedirect({
    searchParams,
    basePath: `/${params.countryCode}/store`,
    countryCode: params.countryCode,
    filters: { q },
  })

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={String(page)}
      q={q}
      countryCode={params.countryCode}
    />
  )
}
