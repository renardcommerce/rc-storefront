"use client"

import { ChevronDown, SlidersHorizontal } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"

import SortProducts, { SortOptions } from "./sort-products"

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  "data-testid"?: string
}

// Sortering: op desktop altijd zichtbaar als pillen, op mobiel inklapbaar.
const RefinementList = ({
  sortBy,
  "data-testid": dataTestId,
}: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
      // Nieuwe sortering → terug naar pagina 1
      params.delete("page")

      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}?${query}`)
    setOpen(false)
  }

  return (
    <div className="mb-6 small:mb-8" data-testid="refinement-list">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="sort-panel"
        className="small:hidden inline-flex h-11 items-center gap-2 rounded-circle bg-white px-5 text-sm font-medium text-ink shadow-card"
        data-testid="sort-toggle"
      >
        <SlidersHorizontal size={16} aria-hidden="true" />
        Sorteren
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={open ? "rotate-180" : ""}
        />
      </button>
      <div
        id="sort-panel"
        className={`${
          open ? "block" : "hidden"
        } mt-3 rounded-large bg-white p-4 shadow-card small:mt-0 small:block small:bg-transparent small:p-0 small:shadow-none`}
      >
        <SortProducts
          sortBy={sortBy}
          setQueryParams={setQueryParams}
          data-testid={dataTestId}
        />
      </div>
    </div>
  )
}

export default RefinementList
