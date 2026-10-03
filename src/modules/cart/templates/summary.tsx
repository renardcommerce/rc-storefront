"use client"

import { Button, Heading } from "@medusajs/ui"

import CartTotals from "@modules/common/components/cart-totals"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import FreeShippingNotice from "@modules/common/components/free-shipping-notice"
import { HttpTypes } from "@medusajs/types"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart)

  return (
    <div className="flex flex-col gap-y-5">
      <Heading level="h2" className="text-xl font-semibold text-ink">
        Overzicht
      </Heading>
      <DiscountCode cart={cart} />
      <FreeShippingNotice
        itemTotal={cart.item_total}
        currencyCode={cart.currency_code}
      />
      <CartTotals totals={cart} />
      <LocalizedClientLink
        href={"/checkout?step=" + step}
        data-testid="checkout-button"
      >
        <Button
          className="w-full h-12 !rounded-circle !bg-ink !text-paper hover:!bg-grey-80 !shadow-none !border-0"
        >
          Naar afrekenen
        </Button>
      </LocalizedClientLink>
    </div>
  )
}

export default Summary
