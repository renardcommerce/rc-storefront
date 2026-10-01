import { Headset, LucideIcon, RotateCcw, Truck, Zap } from "lucide-react"

import { FREE_SHIPPING_THRESHOLD } from "@lib/util/shipping"

// Levertijd bewust niet genoemd tot die bekend is ([LEVERTIJD]).
const usps: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Truck,
    title: `Gratis verzending vanaf € ${FREE_SHIPPING_THRESHOLD}`,
    text: "Geldt voor bestellingen in Nederland en België.",
  },
  {
    icon: RotateCcw,
    title: "14 dagen bedenktijd",
    text: "Niet tevreden? Je kunt je bestelling binnen 14 dagen retourneren.",
  },
  {
    icon: Zap,
    title: "Snelle levering",
    text: "Je bestelling gaat snel op pad.",
  },
  {
    icon: Headset,
    title: "Nederlandse klantenservice",
    text: "Vragen? Wij helpen je in het Nederlands.",
  },
]

const Usps = () => {
  return (
    <section className="bg-bone">
      <div className="content-container py-12 small:py-16">
        <ul className="grid grid-cols-1 xsmall:grid-cols-2 small:grid-cols-4 gap-8">
          {usps.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-start gap-4">
              <Icon
                size={28}
                className="shrink-0 text-gold"
                aria-hidden="true"
              />
              <div>
                <p className="font-semibold text-ink">{title}</p>
                <p className="mt-1 text-sm text-grey-60">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Usps
