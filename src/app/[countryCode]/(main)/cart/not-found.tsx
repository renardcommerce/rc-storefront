import { Metadata } from "next"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import StatusPage, {
  primaryButtonClass,
} from "@modules/common/components/status-page"

export const metadata: Metadata = {
  title: "Winkelwagen niet gevonden | RC Choice",
  description: "Deze winkelwagen bestaat niet (meer).",
}

export default function NotFound() {
  return (
    <StatusPage
      code="404"
      eyebrow="Winkelwagen"
      title="Winkelwagen niet gevonden"
      text="Deze winkelwagen bestaat niet meer. Wis je cookies en probeer het opnieuw."
      testId="cart-not-found-page"
    >
      <LocalizedClientLink href="/" className={primaryButtonClass}>
        Naar de homepage
      </LocalizedClientLink>
    </StatusPage>
  )
}
