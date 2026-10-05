import LocalizedClientLink from "@modules/common/components/localized-client-link"
import {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_COST_TEXT,
} from "@lib/util/shipping"

const DeliveryBlock = () => {
  return (
    <section
      className="rounded-large bg-white p-5 shadow-card"
      data-testid="delivery-block"
    >
      <h2 className="eyebrow mb-3">Levering</h2>
      <ul className="flex flex-col gap-y-2 text-sm text-grey-70">
        <li>
          <span className="font-semibold text-ink">
            Gratis verzending vanaf € {FREE_SHIPPING_THRESHOLD}
          </span>
          , daaronder {SHIPPING_COST_TEXT}
        </li>
        <li>Wij verzenden naar Nederland en België</li>
        <li>
          <span className="font-semibold text-ink">14 dagen bedenktijd</span>{" "}
          na ontvangst.{" "}
          <LocalizedClientLink href="/content/retourneren" className="underline">
            Retourvoorwaarden
          </LocalizedClientLink>
        </li>
      </ul>
    </section>
  )
}

export default DeliveryBlock
