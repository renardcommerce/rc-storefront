import { convertToLocale } from "@lib/util/money"
import { getFreeShippingStatus } from "@lib/util/shipping"

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

  return (
    <p
      className="txt-medium text-ui-fg-subtle"
      data-testid="free-shipping-notice"
    >
      {isFree
        ? "Gratis verzending"
        : `Nog ${convertToLocale({
            amount: remaining,
            currency_code: currencyCode,
          })} tot gratis verzending`}
    </p>
  )
}

export default FreeShippingNotice
