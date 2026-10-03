import { Heading } from "@medusajs/ui"

import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  return (
    <div className="small:sticky small:top-8 self-start">
      <div className="flex w-full flex-col gap-y-5 rounded-large bg-white p-5 small:p-8 shadow-card">
        <Heading level="h2" className="text-xl font-semibold text-ink">
          In je winkelwagen
        </Heading>
        <ItemsPreviewTemplate cart={cart} />
        <DiscountCode cart={cart} />
        <div className="h-px w-full bg-bone" />
        <CartTotals totals={cart} />
      </div>
    </div>
  )
}

export default CheckoutSummary
