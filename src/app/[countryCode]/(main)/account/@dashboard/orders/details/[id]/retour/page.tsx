import { Metadata } from "next"
import { notFound } from "next/navigation"

import { COMPANY } from "@lib/content/pages"
import { RETURN_COST_TEXT } from "@lib/content/returns"
import { listReturnReasons, retrieveReturnOrder } from "@lib/data/returns"
import { RETURN_WINDOW_DAYS } from "@lib/util/returns"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ReturnForm from "@modules/returns/components/return-form"

type Props = { params: Promise<{ id: string; countryCode: string }> }

export const metadata: Metadata = {
  title: "Retour aanmelden",
  description: "Meld een retour aan voor je bestelling.",
}

export default async function ReturnPage(props: Props) {
  const { id, countryCode } = await props.params
  const ro = await retrieveReturnOrder(id)

  if (!ro) {
    notFound()
  }

  const reasons = ro.eligible ? await listReturnReasons() : []

  return (
    <div className="flex flex-col gap-y-4" data-testid="return-page">
      <div>
        <p className="eyebrow mb-2">Bestelling #{ro.order.display_id}</p>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Retour aanmelden</h1>
      </div>

      {ro.eligible ? (
        <>
          <p className="text-sm text-grey-70">
            Kies de artikelen die je wilt retourneren en geef per artikel een reden. Dat kan tot{" "}
            {RETURN_WINDOW_DAYS} dagen na levering. {RETURN_COST_TEXT}
          </p>
          <ReturnForm order={ro.order} reasons={reasons} countryCode={countryCode} />
        </>
      ) : (
        <div className="rounded-large border border-grey-20 p-5" data-testid="return-not-eligible">
          <p className="font-semibold text-ink">Retour aanmelden is hier niet mogelijk.</p>
          <p className="mt-1 text-sm text-grey-70">
            {ro.deliveredAt
              ? `Je kunt een retour aanmelden tot ${RETURN_WINDOW_DAYS} dagen na levering en die termijn is verstreken.`
              : "We zien nog geen bezorgdatum bij deze bestelling, of die kunnen we niet bepalen."}{" "}
            Neem contact met ons op via {COMPANY.email}.
          </p>
        </div>
      )}

      <LocalizedClientLink
        href={`/account/orders/details/${id}`}
        className="w-fit text-sm text-grey-60 underline hover:text-ink"
      >
        Terug naar de bestelling
      </LocalizedClientLink>
    </div>
  )
}
