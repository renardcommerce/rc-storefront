import { SHOW_TIER_DISCOUNT, TIER_DISCOUNTS } from "@lib/util/tier-discount"

// Staffelkorting-blok onder de prijs. Rendert niets zolang de flag uit staat.
export default function TierDiscount() {
  if (!SHOW_TIER_DISCOUNT) {
    return null
  }

  return (
    <ul
      className="flex flex-wrap gap-2 text-small-regular"
      data-testid="tier-discount"
    >
      {TIER_DISCOUNTS.map((tier) => (
        <li
          key={tier.quantity}
          className="rounded-lg border border-ui-border-base bg-ui-bg-subtle px-3 py-1.5"
        >
          <span className="font-semibold">{tier.quantity} stuks</span>{" "}
          <span className="text-ui-fg-subtle">{tier.percentage}% korting</span>
        </li>
      ))}
    </ul>
  )
}
