import { Metadata } from "next"

import InteractiveLink from "@modules/common/components/interactive-link"

export const metadata: Metadata = {
  title: "404",
  description: "Er ging iets mis",
}

export default function NotFound() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="text-2xl-semi text-ui-fg-base">Pagina niet gevonden</h1>
      <p className="text-small-regular text-ui-fg-base">
        De pagina die je probeert te bereiken bestaat niet.
      </p>
      <InteractiveLink href="/">Ga naar de homepage</InteractiveLink>
    </div>
  )
}
