"use client"

import { Search } from "lucide-react"
import { useParams, useSearchParams } from "next/navigation"

// Vaste zoekbalk in de header. Gewone GET-form naar /store?q=..., werkt dus ook zonder JS.
const SearchBar = ({ className }: { className?: string }) => {
  const { countryCode } = useParams<{ countryCode?: string }>()
  const searchParams = useSearchParams()

  return (
    <form
      role="search"
      action={countryCode ? `/${countryCode}/store` : "/store"}
      method="get"
      className={className}
      data-testid="nav-search-form"
    >
      <label htmlFor="nav-search" className="sr-only">
        Zoek in alle producten
      </label>
      <div className="relative">
        <Search
          size={18}
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-grey-50"
        />
        <input
          id="nav-search"
          type="search"
          name="q"
          defaultValue={searchParams.get("q") ?? ""}
          placeholder="Zoek kabels, adapters…"
          autoComplete="off"
          className="h-11 w-full rounded-circle border border-bone bg-paper pl-11 pr-4 text-sm text-ink placeholder:text-grey-50 focus:border-ink focus:bg-white focus:outline-none"
          data-testid="nav-search-input"
        />
      </div>
    </form>
  )
}

export default SearchBar
