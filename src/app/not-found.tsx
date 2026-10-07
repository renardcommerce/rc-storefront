import { Metadata } from "next"
import Link from "next/link"

import StatusPage, {
  primaryButtonClass,
} from "@modules/common/components/status-page"

export const metadata: Metadata = {
  title: "Pagina niet gevonden | RC Choice",
  description: "Deze pagina bestaat niet (meer).",
}

// Buiten een regio-pad (geen landcode bekend): gewone link, de middleware kiest de regio.
export default function NotFound() {
  return (
    <StatusPage
      code="404"
      eyebrow="Pagina niet gevonden"
      title="Deze pagina bestaat niet (meer)"
      text="De pagina die je probeert te bereiken bestaat niet. Ga terug naar de homepage."
      testId="not-found-page"
    >
      <Link href="/" className={primaryButtonClass}>
        Naar de homepage
      </Link>
    </StatusPage>
  )
}
