import { ArrowRight, ShoppingBag } from "lucide-react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

const EmptyCartMessage = () => {
  return (
    <div
      className="mx-auto flex max-w-xl flex-col items-center rounded-large bg-white px-6 py-16 text-center shadow-card small:py-24"
      data-testid="empty-cart-message"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-circle bg-bone">
        <ShoppingBag size={28} className="text-ink" aria-hidden="true" />
      </span>
      <p className="eyebrow mt-6">Winkelwagen</p>
      <h1 className="mt-2 text-2xl small:text-3xl font-semibold tracking-tight text-ink">
        Je winkelwagen is leeg
      </h1>
      <p className="mt-3 max-w-sm text-base text-grey-70">
        Voeg een kabel of adapter toe om te beginnen.
      </p>
      <LocalizedClientLink
        href="/store"
        className="mt-8 inline-flex h-12 items-center gap-2 rounded-circle bg-ink px-7 text-sm font-semibold text-paper transition-colors hover:bg-grey-80"
        data-testid="empty-cart-link"
      >
        Bekijk alle producten
        <ArrowRight size={18} aria-hidden="true" />
      </LocalizedClientLink>
    </div>
  )
}

export default EmptyCartMessage
