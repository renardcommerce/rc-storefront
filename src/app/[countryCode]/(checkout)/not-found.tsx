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
      text="De pagina die je zoekt bestaat niet. Ga terug naar de winkelwagen of de homepage."
      testId="not-found-page"
    >
      <LocalizedClientLink href="/cart" className={primaryButtonClass}>
        Naar de winkelwagen
      </LocalizedClientLink>
      <LocalizedClientLink href="/" className={secondaryButtonClass}>
        Naar de homepage
      </LocalizedClientLink>
    </StatusPage>
  )
}
