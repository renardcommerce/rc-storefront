import { SHOW_TIER_DISCOUNT, TIER_DISCOUNTS } from "@lib/util/tier-discount"

// Staffelkorting-blok onder de prijs. Rendert niets zolang de flag uit staat.
export default function TierDiscount() {
  if (!SHOW_TIER_DISCOUNT) {
    return null
  }

  return (
    <ul
      className="grid grid-cols-3 gap-2 text-small-regular"
      data-testid="tier-discount"
    >
      {TIER_DISCOUNTS.map((tier) => (
        <li
          key={tier.quantity}
          className="rounded-rounded bg-bone px-2 py-1.5 text-center leading-tight"
        >
          <span className="block font-semibold">{tier.quantity} stuks</span>
          <span className="block text-ui-fg-subtle">
            {tier.percentage}% korting
          </span>
        </li>
      ))}
    </ul>
  )
}
