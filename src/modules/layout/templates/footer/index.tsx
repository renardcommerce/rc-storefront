import { FREE_SHIPPING_TEXT } from "@lib/util/shipping"
import { listCategories } from "@lib/data/categories"
import { Text, clx } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

const serviceLinks = [
  { name: "Veelgestelde vragen", href: "/content/faq" },
  { name: "Contact", href: "/content/contact" },
  { name: "Verzending & levering", href: "/content/verzending" },
  { name: "Retourneren & herroeping", href: "/content/retourneren" },
]

const legalLinks = [
  { name: "Algemene voorwaarden", href: "/content/algemene-voorwaarden" },
  { name: "Privacybeleid", href: "/content/privacybeleid" },
]

export default async function Footer() {
  const productCategories = await listCategories()

  return (
    <footer className="w-full bg-bone mt-8">
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-y-10 small:flex-row items-start justify-between py-14 small:py-20">
          <div className="flex flex-col gap-y-3 max-w-xs">
            <LocalizedClientLink
              href="/"
              className="text-lg font-semibold uppercase tracking-[0.2em] text-ink"
            >
              RC <span className="text-gold">Choice</span>
            </LocalizedClientLink>
            <Text className="text-sm text-grey-70">
              Kabels en adapters voor thuis en kantoor. {FREE_SHIPPING_TEXT}.
            </Text>
          </div>
          <div className="gap-10 md:gap-x-16 grid grid-cols-2 xsmall:grid-cols-3 min-w-0">
            {productCategories && productCategories?.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="eyebrow">
                  Categorieën
                </span>
                <ul
                  className="grid grid-cols-1 gap-2"
                  data-testid="footer-categories"
                >
                  {productCategories
                    ?.filter((c) => !c.parent_category)
                    .slice(0, 6)
                    .map((c) => (
                      <li
                        className="text-grey-70 text-sm"
                        key={c.id}
                      >
                        <LocalizedClientLink
                          className={clx("hover:text-ink hover:underline")}
                          href={`/categories/${c.handle}`}
                          data-testid="category-link"
                        >
                          {c.name}
                        </LocalizedClientLink>
                      </li>
                    ))}
                </ul>
              </div>
            )}
            <div className="flex flex-col gap-y-2">
              <span className="eyebrow">
                Klantenservice
              </span>
              <ul className="grid grid-cols-1 gap-y-2 text-grey-70 text-sm">
                {serviceLinks.map((l) => (
                  <li key={l.href}>
                    <LocalizedClientLink
                      className="hover:text-ink hover:underline"
                      href={l.href}
                    >
                      {l.name}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-y-2">
              <span className="eyebrow">
                Over RC Choice
              </span>
              <ul className="grid grid-cols-1 gap-y-2 text-grey-70 text-sm">
                {legalLinks.map((l) => (
                  <li key={l.href}>
                    <LocalizedClientLink
                      className="hover:text-ink hover:underline"
                      href={l.href}
                    >
                      {l.name}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="flex w-full border-t border-grey-30 py-6 justify-between">
          <Text className="text-xs text-grey-60">
            © {new Date().getFullYear()} RC Choice, een merk van Renard
            Commerce. Alle rechten voorbehouden.
          </Text>
        </div>
      </div>
    </footer>
  )
}
