import { convertToLocale } from "@lib/util/money"
import {
  getFreeShippingProgress,
  getFreeShippingStatus,
} from "@lib/util/shipping"

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

  const progress = getFreeShippingProgress(itemTotal)

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
        role="progressbar"
        aria-label="Voortgang gratis verzending"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <div
          className="h-full rounded-circle bg-ink transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

export default FreeShippingNotice
