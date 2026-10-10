/**
 * Publieke basis-URL van de storefront (canonical, JSON-LD, og/twitter-afbeelding, sitemap).
 *
 * NEXT_PUBLIC_BASE_URL wordt bij het BOUWEN ingebakken: zet de variabele dus als
 * build-variabele en herbouw na elke wijziging.
 *
 * In productie is een ontbrekende waarde een fout: de build mislukt in plaats van
 * stilzwijgend naar localhost te verwijzen (dat gebeurde eerder: canonical,
 * JSON-LD en social-afbeeldingen wezen naar https://localhost:8000).
 */
export const getBaseURL = () => {
  const url = process.env.NEXT_PUBLIC_BASE_URL?.trim()

  if (url) {
    return url.replace(/\/+$/, "")
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "NEXT_PUBLIC_BASE_URL ontbreekt. Zet bijvoorbeeld NEXT_PUBLIC_BASE_URL=https://shop.rcchoice.nl als build-variabele."
    )
  }

  return "http://localhost:8000"
}
