import { ArrowRight } from "lucide-react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <section className="w-full bg-paper">
      <div className="content-container py-6 small:py-10">
        <div className="rounded-large bg-bone px-6 py-14 small:px-16 small:py-24 shadow-card">
          <div className="max-w-2xl">
            <p className="eyebrow">RC Choice · Kabels &amp; adapters</p>
            <h1 className="mt-4 text-4xl small:text-6xl font-semibold leading-[1.05] tracking-tight text-ink">
              De juiste kabel.
              <br />
              Meteen geregeld.
            </h1>
            <p className="mt-6 max-w-xl text-base small:text-lg text-grey-70">
              Betrouwbare HDMI-, DisplayPort-, USB- en netwerkkabels voor thuis
              en kantoor.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <LocalizedClientLink
                href="/store"
                className="inline-flex h-12 items-center gap-2 rounded-circle bg-ink px-7 text-sm font-semibold text-paper transition-colors duration-200 hover:bg-grey-80"
                data-testid="hero-cta"
              >
                Bekijk alle producten
                <ArrowRight size={18} aria-hidden="true" />
              </LocalizedClientLink>
              <span className="text-sm text-grey-60">
                Gratis verzending vanaf € 20 · NL &amp; BE
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
