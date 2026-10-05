"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"

// Ververst de serverpagina, zodat de producten opnieuw worden opgehaald.
const RetryButton = () => {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  return (
    <button
      type="button"
      onClick={() => startTransition(() => router.refresh())}
      disabled={pending}
      className="mt-4 h-10 rounded-circle bg-ink px-6 text-sm font-medium text-paper transition-colors hover:bg-grey-80 disabled:opacity-60"
      data-testid="retry-button"
    >
      {pending ? "Bezig…" : "Opnieuw proberen"}
    </button>
  )
}

export default RetryButton
