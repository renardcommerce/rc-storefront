import { HttpTypes } from "@medusajs/types"

type PhotoSource = Pick<HttpTypes.StoreProduct, "thumbnail" | "images">

// Eerste echte productfoto (thumbnail, anders eerste galerijfoto), of null.
export const getProductPhoto = (p: PhotoSource): string | null =>
  p.thumbnail || p.images?.[0]?.url || null

// Een tweede, andere foto voor de hover op productkaarten, of null.
export const getHoverPhoto = (p: PhotoSource): string | null => {
  const first = getProductPhoto(p)
  return p.images?.find((img) => img.url && img.url !== first)?.url ?? null
}

// Alleen producten met foto mogen in hero, categorietegels en Populair-rij.
export const hasProductPhoto = (p: PhotoSource): boolean =>
  Boolean(getProductPhoto(p))
