"use client"

import { Heading, Text, clx } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import PaymentButton from "../payment-button"
import { useSearchParams } from "next/navigation"

const Review = ({ cart }: { cart: any }) => {
  const searchParams = useSearchParams()

  const isOpen = searchParams.get("step") === "review"

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods.length > 0 &&
    (cart.payment_collection || paidByGiftcard)

  return (
    <div className="rounded-large bg-white p-5 small:p-8 shadow-card">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-xl font-semibold text-ink gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none": !isOpen,
            }
          )}
        >
          <span className="mr-2 text-grey-50">4.</span>Controleren
        </Heading>
      </div>
      {isOpen && previousStepsCompleted && (
        <>
          <div className="flex items-start gap-x-1 w-full mb-6">
            <div className="w-full">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                Door op de knop Bestelling plaatsen te klikken, bevestig je dat
                je onze{" "}
                <LocalizedClientLink
                  href="/content/algemene-voorwaarden"
                  className="underline"
                  target="_blank"
                >
                  Algemene voorwaarden
                </LocalizedClientLink>{" "}
                en het{" "}
                <LocalizedClientLink
                  href="/content/retourneren"
                  className="underline"
                  target="_blank"
                >
                  Retourbeleid
                </LocalizedClientLink>{" "}
                hebt gelezen en accepteert, en dat je het{" "}
                <LocalizedClientLink
                  href="/content/privacybeleid"
                  className="underline"
                  target="_blank"
                >
                  Privacybeleid
                </LocalizedClientLink>{" "}
                van RC CHOICE hebt gelezen.
              </Text>
            </div>
          </div>
          <PaymentButton cart={cart} data-testid="submit-order-button" />
        </>
      )}
    </div>
  )
}

export default Review
