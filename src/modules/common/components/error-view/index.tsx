"use client"

import { useEffect } from "react"

import StatusPage, {
  primaryButtonClass,
  secondaryButtonClass,
} from "@modules/common/components/status-page"

// Foutpagina voor error.tsx / global-error.tsx. Toont nooit de foutmelding zelf
// (kan interne details bevatten), alleen de digest-code voor in de serverlog.
const ErrorView = ({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) => {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <StatusPage
      eyebrow="Fout"
      title="Er ging iets mis"
      text="Deze pagina kon niet worden geladen. Probeer het nog eens. Lukt het nog steeds niet, kom dan later terug of neem contact met ons op."
      testId="error-page"
    >
      <button
        type="button"
        onClick={() => reset()}
        className={primaryButtonClass}
        data-testid="error-retry"
      >
        Opnieuw proberen
      </button>
      {/* gewone link (volledige herlaadbeurt): de middleware kiest de regio */}
      <a href="/" className={secondaryButtonClass}>
        Naar de homepage
      </a>
      {error.digest && (
        <p className="mt-2 w-full text-xs text-grey-60">
          Foutcode: {error.digest}
        </p>
      )}
    </StatusPage>
  )
}

export default ErrorView
