import { ArrowRight } from "lucide-react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <section className="w-full bg-ink text-paper">
      <div className="content-container flex flex-col items-center text-center py-20 small:py-32 gap-6">
        <p className="text-3xl small:text-5xl font-semibold tracking-[0.2em] uppercase">
          <span className="text-white">RC</span>{" "}
          <span className="text-gold">Choice</span>
        </p>
        <h1 className="text-2xl small:text-4xl font-semibold leading-tight max-w-2xl">
          De juiste kabel. Meteen geregeld.
        </h1>
        <p className="text-base small:text-lg text-bone/80 max-w-xl">
          Betrouwbare HDMI-, DisplayPort-, USB- en netwerkkabels.
        </p>
        <LocalizedClientLink
          href="/store"
          className="mt-2 inline-flex items-center gap-2 rounded-soft bg-gold px-8 py-4 text-sm font-semibold uppercase tracking-wider text-ink hover:bg-white transition-colors duration-200"
          data-testid="hero-cta"
        >
          Bekijk alle producten
          <ArrowRight size={18} aria-hidden="true" />
        </LocalizedClientLink>
      </div>
    </section>
  )
}

export default Hero
