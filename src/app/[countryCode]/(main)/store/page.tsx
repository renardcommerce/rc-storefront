import { Metadata } from "next"

import { resolvePageOrRedirect } from "@lib/data/pagination-redirect"
import { breadcrumbJsonLd, canonicalPath, seoPage, seoTitle, withSeo } from "@lib/seo"
import JsonLd from "@modules/seo/json-ld"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"


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

const BASE_METADATA: Metadata = {
  title: "Alle producten",
  description: "Bekijk alle RC Choice producten.",
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const { countryCode } = await props.params
  const searchParams = await props.searchParams

  return withSeo(BASE_METADATA, () => {
    const q = searchParams.q?.trim().slice(0, 100)
    const page = seoPage(searchParams.page)
    return {
      title: seoTitle(q ? `Zoekresultaten voor “${q}”` : "Alle producten", page),
      description: q
        ? `Zoekresultaten voor “${q}” bij RC Choice.`
        : "Bekijk alle RC Choice producten: kabels, adapters en accessoires.",
      // sortering en zoekterm horen niet in de canonical; zoekresultaten niet indexeren
      alternates: { canonical: canonicalPath(`/${countryCode}/store`, q ? 1 : page) },
      ...(q ? { robots: { index: false, follow: true } } : {}),
    }
  })
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
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: `/${params.countryCode}` },
          { name: "Alle producten", path: `/${params.countryCode}/store` },
        ])}
      />
      <StoreTemplate
        sortBy={sortBy}
        page={String(page)}
        q={q}
        countryCode={params.countryCode}
      />
    </>
  )
}
