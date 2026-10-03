"use client"

import { Check, X } from "lucide-react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export type AddToCartStatus =
  | { type: "success"; quantity: number }
  | { type: "error"; message: string }
  | null

// Korte melding na "In winkelwagen" (ook zichtbaar op mobiel, waar de
// mini-cart in de header niet beschikbaar is). aria-live: wordt voorgelezen.
const AddedToCartToast = ({
  status,
  productTitle,
  onClose,
}: {
  status: AddToCartStatus
  productTitle: string
  onClose: () => void
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-24 z-[60] small:inset-x-auto small:bottom-6 small:right-6 small:w-96"
    >
      {status && (
        <div
          className="pointer-events-auto flex items-start gap-x-3 rounded-large bg-ink p-4 text-paper shadow-card-hover"
          data-testid="add-to-cart-toast"
        >
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-circle bg-paper text-ink">
            {status.type === "success" ? (
              <Check size={14} aria-hidden="true" />
            ) : (
              <X size={14} aria-hidden="true" />
            )}
          </span>
          <div className="min-w-0 flex-1 text-sm">
            {status.type === "success" ? (
              <>
                <p className="font-semibold">Toegevoegd aan winkelwagen</p>
                <p className="mt-0.5 truncate text-bone/80">
                  {status.quantity}× {productTitle}
                </p>
                <LocalizedClientLink
                  href="/cart"
                  className="mt-2 inline-block font-semibold underline underline-offset-4"
                  data-testid="toast-cart-link"
                >
                  Bekijk winkelwagen
                </LocalizedClientLink>
              </>
            ) : (
              <>
                <p className="font-semibold">Toevoegen mislukt</p>
                <p className="mt-0.5 text-bone/80">{status.message}</p>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Melding sluiten"
            className="shrink-0 text-bone/80 hover:text-paper"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  )
}

export default AddedToCartToast
