import { Metadata } from "next"

import Categories from "@modules/home/components/categories"
import Hero from "@modules/home/components/hero"
import Popular from "@modules/home/components/popular"
import Usps from "@modules/home/components/usps"
import { listHomeProducts } from "@lib/data/home"
import { getRegion } from "@lib/data/regions"
import { withSeo } from "@lib/seo"

const BASE_METADATA: Metadata = {
  title: "RC Choice | Kabels & Accessoires",
  description:
    "Betrouwbare kabels, adapters en accessoires van RC Choice.",
}

export async function generateMetadata(props: {
  params: Promise<{ countryCode: string }>
}): Promise<Metadata> {
  const { countryCode } = await props.params
  return withSeo(BASE_METADATA, () => ({
    alternates: { canonical: `/${countryCode}` },
  }))
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const { products } = await listHomeProducts(region).catch(() => ({
    products: [],
  }))

  return (
    <>
      <Hero product={products[0]} />
      <Categories region={region} />
      <Popular products={products.slice(1)} region={region} />
      <Usps />
    </>
  )
}
