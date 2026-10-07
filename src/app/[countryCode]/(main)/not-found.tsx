import { Metadata } from "next"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import StatusPage, {
  primaryButtonClass,
  secondaryButtonClass,
} from "@modules/common/components/status-page"

export const metadata: Metadata = {
  title: "Pagina niet gevonden | RC Choice",
  description: "Deze pagina bestaat niet (meer).",
}

export default function NotFound() {
  return (
    <StatusPage
      code="404"
      eyebrow="Pagina niet gevonden"
      title="Deze pagina bestaat niet (meer)"
      text="Het product is mogelijk verplaatst of de link klopt niet. Bekijk ons assortiment of ga terug naar de homepage."
      testId="not-found-page"
    >
      <LocalizedClientLink href="/store" className={primaryButtonClass}>
        Alle producten
      </LocalizedClientLink>
      <LocalizedClientLink href="/" className={secondaryButtonClass}>
        Naar de homepage
      </LocalizedClientLink>
    </StatusPage>
  )
}
