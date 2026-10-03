import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SearchBar from "@modules/layout/components/search-bar"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative mx-auto border-b border-bone bg-paper/95 backdrop-blur">
        <nav className="content-container whitespace-nowrap grid grid-cols-[auto_1fr] small:grid-cols-[auto_1fr_auto] items-center gap-x-6 text-sm font-medium text-ink">
          <div className="flex h-16 items-center">
            <LocalizedClientLink
              href="/"
              className="text-lg font-semibold uppercase tracking-[0.2em]"
              data-testid="nav-store-link"
            >
              RC <span className="text-gold">Choice</span>
            </LocalizedClientLink>
          </div>

          <div className="col-span-2 row-start-2 pb-3 small:col-span-1 small:col-start-2 small:row-start-1 small:pb-0 small:max-w-xl small:w-full small:justify-self-start">
            <SearchBar />
          </div>

          <div className="flex h-16 items-center justify-self-end gap-x-4 small:col-start-3 small:row-start-1 small:gap-x-6">
            <LocalizedClientLink
              className="hidden hover:text-grey-60 small:block"
              href="/account"
              data-testid="nav-account-link"
            >
              Account
            </LocalizedClientLink>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="flex gap-2 hover:text-grey-60"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Winkelwagen (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
            <div className="h-full">
              <SideMenu
                regions={regions}
                locales={locales}
                currentLocale={currentLocale}
              />
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
