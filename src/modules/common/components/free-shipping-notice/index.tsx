import { convertToLocale } from "@lib/util/money"
import { FREE_SHIPPING_THRESHOLD, getFreeShippingStatus } from "@lib/util/shipping"

type FreeShippingNoticeProps = {
  itemTotal?: number | null
  currencyCode: string
}

// itemTotal = cart.item_total (incl. btw, na korting): dezelfde waarde die
// Medusa gebruikt voor de prijsregel van de verzendoptie.
const FreeShippingNotice = ({
  itemTotal,
  currencyCode,
}: FreeShippingNoticeProps) => {
  const { isFree, remaining } = getFreeShippingStatus(itemTotal)

  const progress = Math.min(
    100,
    Math.max(0, ((FREE_SHIPPING_THRESHOLD - remaining) / FREE_SHIPPING_THRESHOLD) * 100)
  )

  return (
    <div
      className="rounded-rounded bg-bone px-4 py-3"
      data-testid="free-shipping-notice"
    >
      <p className="text-sm font-medium text-ink">
        {isFree
          ? "Je krijgt gratis verzending (NL & BE)"
          : `Nog ${convertToLocale({
              amount: remaining,
              currency_code: currencyCode,
            })} tot gratis verzending`}
      </p>
      <div
        className="mt-2 h-1.5 overflow-hidden rounded-circle bg-white"
        aria-hidden="true"
      >
        <div
          className="h-full rounded-circle bg-ink transition-all"
          style={{ width: `${isFree ? 100 : progress}%` }}
        />
      </div>
    </div>
  )
}

export default FreeShippingNotice
