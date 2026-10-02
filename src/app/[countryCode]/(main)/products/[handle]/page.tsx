import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import ProductTemplate from "@modules/products/templates"
import { HttpTypes } from "@medusajs/types"
import { getBaseURL } from "@lib/util/env"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
  searchParams: Promise<{ v_id?: string }>
}

export async function generateStaticParams() {
  try {
    const countryCodes = await listRegions().then((regions) =>
      regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    )

    if (!countryCodes) {
      return []
    }

    const promises = countryCodes.map(async (country) => {
      const { response } = await listProducts({
        countryCode: country,
        queryParams: { limit: 100, fields: "handle" },
      })

      return {
        country,
        products: response.products,
      }
    })

    const countryProducts = await Promise.all(promises)

    return countryProducts
      .flatMap((countryData) =>
        countryData.products.map((product) => ({
          countryCode: countryData.country,
          handle: product.handle,
        }))
      )
      .filter((param) => param.handle)
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
}

function getImagesForVariant(
  product: HttpTypes.StoreProduct,
  selectedVariantId?: string
) {
  if (!selectedVariantId || !product.variants) {
    return product.images
  }

  const variant = product.variants!.find((v) => v.id === selectedVariantId)
  if (!variant || !variant.images.length) {
    return product.images
  }

  const imageIdsMap = new Map(variant.images.map((i) => [i.id, true]))
  return product.images!.filter((i) => imageIdsMap.has(i.id))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle } = params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const product = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle },
  }).then(({ response }) => response.products[0])

  if (!product) {
    notFound()
  }

  const description = metaDescription(product)

  return {
    title: `${product.title} | RC Choice`,
    description,
    alternates: {
      canonical: `/${params.countryCode}/products/${handle}`,
    },
    openGraph: {
      title: `${product.title} | RC Choice`,
      description,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

function metaDescription(product: HttpTypes.StoreProduct) {
  const text = (product.description || product.subtitle || product.title || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
  return text.length > 155 ? `${text.slice(0, 152).trimEnd()}...` : text
}

function productJsonLd(product: HttpTypes.StoreProduct, countryCode: string) {
  const variant = product.variants?.[0]
  const price = variant?.calculated_price?.calculated_amount
  const currency = variant?.calculated_price?.currency_code?.toUpperCase()
  const ean = variant?.barcode || variant?.ean || undefined

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: metaDescription(product),
    image: (product.images || []).map((i) => i.url).slice(0, 5),
    sku: variant?.sku || undefined,
    gtin13: ean,
    brand: { "@type": "Brand", name: "RC Choice" },
    offers:
      price != null && currency
        ? {
            "@type": "Offer",
            url: `${getBaseURL()}/${countryCode}/products/${product.handle}`,
            price: Number(price).toFixed(2),
            priceCurrency: currency,
            availability: "https://schema.org/InStock",
            itemCondition: "https://schema.org/NewCondition",
          }
        : undefined,
  }
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  const region = await getRegion(params.countryCode)
  const searchParams = await props.searchParams

  const selectedVariantId = searchParams.v_id

  if (!region) {
    notFound()
  }

  const pricedProduct = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle: params.handle },
  }).then(({ response }) => response.products[0])

  const images = getImagesForVariant(pricedProduct, selectedVariantId)

  if (!pricedProduct) {
    notFound()
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            productJsonLd(pricedProduct, params.countryCode)
          ).replace(/</g, "\\u003c"),
        }}
      />
      <ProductTemplate
        product={pricedProduct}
        region={region}
        countryCode={params.countryCode}
        images={images}
      />
    </>
  )
}
