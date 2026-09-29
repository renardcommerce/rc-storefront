import { MetadataRoute } from "next"

import { listCategories } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import { getBaseURL } from "@lib/util/env"

// Sitemap staat pas aan bij livegang (NEXT_PUBLIC_SITE_INDEXABLE=true).
// Tot die tijd een lege sitemap, zodat staging niet geïndexeerd wordt.
const SITE_INDEXABLE = process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true"
const COUNTRY = "nl"

export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!SITE_INDEXABLE) {
    return []
  }

  const base = getBaseURL()
  const entries: MetadataRoute.Sitemap = [
    { url: `${base}/${COUNTRY}`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/${COUNTRY}/store`, changeFrequency: "daily", priority: 0.8 },
  ]

  try {
    const categories = await listCategories()
    categories?.forEach((c) =>
      entries.push({
        url: `${base}/${COUNTRY}/categories/${c.handle}`,
        changeFrequency: "weekly",
        priority: 0.7,
      })
    )

    let page: number | null = 1
    while (page) {
      const { response, nextPage } = await listProducts({
        pageParam: page,
        countryCode: COUNTRY,
        queryParams: { limit: 100, fields: "handle,updated_at" },
      })
      response.products.forEach((p) =>
        entries.push({
          url: `${base}/${COUNTRY}/products/${p.handle}`,
          lastModified: p.updated_at ? new Date(p.updated_at) : undefined,
          changeFrequency: "weekly",
          priority: 0.6,
        })
      )
      page = nextPage
    }
  } catch (e) {
    console.error("Sitemap: kon producten/categorieën niet ophalen", e)
  }

  return entries
}
