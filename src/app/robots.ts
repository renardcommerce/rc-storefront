import { MetadataRoute } from "next"

// Staging safety net: disallow everything until commercial go-live is
// explicitly approved (see NEXT_PUBLIC_SITE_INDEXABLE in middleware.ts).
const SITE_INDEXABLE = process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true"

export default function robots(): MetadataRoute.Robots {
  if (!SITE_INDEXABLE) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    }
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/checkout", "/account"],
    },
  }
}
