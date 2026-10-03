import { Headset, LucideIcon, RotateCcw, Truck } from "lucide-react"

import { FREE_SHIPPING_THRESHOLD } from "@lib/util/shipping"

// Alleen claims die kloppen. Levertijd bewust niet genoemd tot die bekend is.
const usps: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Truck,
    title: `Gratis verzending vanaf € ${FREE_SHIPPING_THRESHOLD}`,
    text: "Geldt voor bestellingen in Nederland en België.",
  },
  {
    icon: RotateCcw,
    title: "14 dagen bedenktijd",
    text: "Niet tevreden? Je kunt je bestelling binnen 14 dagen herroepen.",
  },
  {
    icon: Headset,
    title: "Nederlandse klantenservice",
    text: "Vragen? Wij helpen je in het Nederlands.",
  },
]

const Usps = () => {
  return (
    <section className="bg-paper">
      <div className="content-container pb-12 small:pb-20">
        <ul className="grid grid-cols-1 small:grid-cols-3 gap-6 small:gap-8 rounded-large bg-bone p-6 small:p-10">
          {usps.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-circle bg-paper">
                <Icon size={22} className="text-ink" aria-hidden="true" />
              </span>
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
