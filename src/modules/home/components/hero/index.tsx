import Image from "next/image"
import { ArrowRight } from "lucide-react"

import { getProductPhoto } from "@lib/util/product-photo"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// product: moet een product met foto zijn (zie listHomeProducts); zonder
// product toont de hero alleen tekst, geen leeg vlak.
const Hero = ({ product }: { product?: HttpTypes.StoreProduct }) => {
  const photo = product ? getProductPhoto(product) : null
  const price = product ? getProductPrice({ product }).cheapestPrice : null

  return (
    <section className="w-full overflow-hidden bg-ink text-paper">
      <div className="content-container grid items-center gap-10 py-12 small:grid-cols-[1.1fr_0.9fr] small:gap-16 small:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            RC Choice · Kabels &amp; adapters
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight small:text-6xl">
            De juiste kabel.
            <br />
            Meteen geregeld.
          </h1>
          <p className="mt-6 max-w-xl text-base text-grey-20 small:text-lg">
            Betrouwbare HDMI-, DisplayPort-, USB- en netwerkkabels voor thuis
            en kantoor.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <LocalizedClientLink
              href="/store"
              className="inline-flex h-12 items-center gap-2 rounded-circle bg-paper px-7 text-sm font-semibold text-ink transition-colors duration-200 hover:bg-gold"
              data-testid="hero-cta"
            >
              Bekijk alle producten
              <ArrowRight size={18} aria-hidden="true" />
            </LocalizedClientLink>
            <span className="text-sm text-grey-20">
              Gratis verzending vanaf € 20 · NL &amp; BE
            </span>
          </div>
        </div>

        {product && photo && (
          <LocalizedClientLink
            href={`/products/${product.handle}`}
            className="group block w-full max-w-md justify-self-center small:max-w-none"
            data-testid="hero-product"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-large bg-bone shadow-card">
              <Image
                src={photo}
                alt={product.title}
                fill
                priority
                quality={70}
                sizes="(max-width: 1024px) 90vw, 560px"
                className="object-contain object-center p-8 mix-blend-multiply transition-transform duration-500 group-hover:scale-105 small:p-12"
              />
            </div>
            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="line-clamp-2 text-sm font-medium text-paper">
                {product.title}
              </p>
              {price && (
                <span className="shrink-0 text-base font-semibold text-gold">
                  {price.calculated_price}
                </span>
              )}
            </div>
          </LocalizedClientLink>
        )}
      </div>
    </section>
  )
}

export default Hero
