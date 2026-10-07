"use client"

import "styles/globals.css"

import ErrorView from "@modules/common/components/error-view"

// Vangt fouten in de root layout op; vervangt de layout, dus eigen <html>/<body>.
export default function GlobalError(props: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="nl" data-mode="light">
      <body className="bg-paper text-ink">
        <ErrorView {...props} />
      </body>
    </html>
  )
}
