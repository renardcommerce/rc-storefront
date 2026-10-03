"use client"

import { convertToLocale } from "@lib/util/money"
import { getDisplayTotals } from "@lib/util/shipping"
import React from "react"

type CartTotalsProps = {
  totals: {
    total?: number | null
    subtotal?: number | null
    tax_total?: number | null
    currency_code: string
    item_subtotal?: number | null
    original_item_total?: number | null
    item_total?: number | null
    shipping_total?: number | null
    discount_total?: number | null
  }
}

const CartTotals: React.FC<CartTotalsProps> = ({ totals }) => {
  const { currency_code, total, tax_total } = totals

  // Alles incl. btw en onderling sluitend (zie getDisplayTotals).
  const display = getDisplayTotals(totals)
  const subtotalInclTax = display.subtotal
  const shipping_total = display.shipping
  const discount_total = display.discount

  return (
    <div>
      <div className="flex flex-col gap-y-2 text-sm text-grey-70">
        <div className="flex items-center justify-between">
          <span>Subtotaal (incl. btw)</span>
          <span data-testid="cart-subtotal" data-value={subtotalInclTax}>
            {convertToLocale({ amount: subtotalInclTax, currency_code })}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Verzending (incl. btw)</span>
          <span data-testid="cart-shipping" data-value={shipping_total || 0}>
            {convertToLocale({ amount: shipping_total ?? 0, currency_code })}
          </span>
        </div>
        {!!discount_total && (
          <div className="flex items-center justify-between">
            <span>Korting</span>
            <span
              className="text-ink"
              data-testid="cart-discount"
              data-value={discount_total || 0}
            >
              -{" "}
              {convertToLocale({
                amount: discount_total ?? 0,
                currency_code,
              })}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="flex gap-x-1 items-center ">Waarvan btw</span>
          <span data-testid="cart-taxes" data-value={tax_total || 0}>
            {convertToLocale({ amount: tax_total ?? 0, currency_code })}
          </span>
        </div>
      </div>
      <div className="my-4 h-px w-full bg-bone" />
      <div className="flex items-center justify-between text-ink">
        <span className="font-semibold">Totaal (incl. btw)</span>
        <span
          className="text-xl font-semibold"
          data-testid="cart-total"
          data-value={total || 0}
        >
          {convertToLocale({ amount: total ?? 0, currency_code })}
        </span>
      </div>
    </div>
  )
}

export default CartTotals
