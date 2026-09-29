import { listCategories } from "@lib/data/categories"
import { Text, clx } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

const serviceLinks = [
  { name: "Klantenservice", href: "/content/klantenservice" },
  { name: "Contact", href: "/content/contact" },
  { name: "Verzending & levering", href: "/content/verzending" },
  { name: "Retourneren", href: "/content/retourneren" },
]

const legalLinks = [
  { name: "Algemene voorwaarden", href: "/content/algemene-voorwaarden" },
  { name: "Privacybeleid", href: "/content/privacybeleid" },
]

export default async function Footer() {
  const productCategories = await listCategories()

  return (
    <footer className="border-t border-ui-border-base w-full">
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-y-10 xsmall:flex-row items-start justify-between py-16">
          <div className="flex flex-col gap-y-3 max-w-xs">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus text-ui-fg-subtle hover:text-ui-fg-base uppercase"
            >
              RC Choice
            </LocalizedClientLink>
            <Text className="txt-small text-ui-fg-subtle">
              Kabels en adapters voor thuis en kantoor. Gratis verzending in
              Nederland.
            </Text>
          </div>
          <div className="text-small-regular gap-10 md:gap-x-16 grid grid-cols-2 sm:grid-cols-3">
            {productCategories && productCategories?.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="txt-small-plus txt-ui-fg-base">
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
                        className="text-ui-fg-subtle txt-small"
                        key={c.id}
                      >
                        <LocalizedClientLink
                          className={clx("hover:text-ui-fg-base")}
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
              <span className="txt-small-plus txt-ui-fg-base">
                Klantenservice
              </span>
              <ul className="grid grid-cols-1 gap-y-2 text-ui-fg-subtle txt-small">
                {serviceLinks.map((l) => (
                  <li key={l.href}>
                    <LocalizedClientLink
                      className="hover:text-ui-fg-base"
                      href={l.href}
                    >
                      {l.name}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-y-2">
              <span className="txt-small-plus txt-ui-fg-base">
                Over RC Choice
              </span>
              <ul className="grid grid-cols-1 gap-y-2 text-ui-fg-subtle txt-small">
                {legalLinks.map((l) => (
                  <li key={l.href}>
                    <LocalizedClientLink
                      className="hover:text-ui-fg-base"
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
        <div className="flex w-full mb-16 justify-between text-ui-fg-muted">
          <Text className="txt-compact-small">
            © {new Date().getFullYear()} RC Choice, een merk van Renard
            Commerce. Alle rechten voorbehouden.
          </Text>
        </div>
      </div>
    </footer>
  )
}
