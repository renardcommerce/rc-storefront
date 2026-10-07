import { SEO_ENABLED } from "@lib/seo"

/** JSON-LD-script; rendert niets als de SEO-vlag uit staat. */
export default function JsonLd({ data }: { data: object }) {
  if (!SEO_ENABLED) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  )
}
