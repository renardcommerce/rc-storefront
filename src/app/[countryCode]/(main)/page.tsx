import { Metadata } from "next"

import Categories from "@modules/home/components/categories"
import FeaturedGrid from "@modules/home/components/featured-grid"
import Hero from "@modules/home/components/hero"
import Usps from "@modules/home/components/usps"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "RC Choice | Kabels & Accessoires",
  description:
    "Betrouwbare kabels, adapters en accessoires van RC Choice.",
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

  return (
    <>
      <Hero />
      <Categories region={region} />
      <Usps />
      <FeaturedGrid region={region} />
    </>
  )
}
