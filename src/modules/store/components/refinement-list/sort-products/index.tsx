"use client"

import { clx } from "@medusajs/ui"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  "data-testid"?: string
}

const sortOptions: { value: SortOptions; label: string }[] = [
  { value: "created_at", label: "Nieuwste eerst" },
  { value: "price_asc", label: "Prijs: laag naar hoog" },
  { value: "price_desc", label: "Prijs: hoog naar laag" },
]

const SortProducts = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
}: SortProductsProps) => {
  return (
    <div
      role="radiogroup"
      aria-label="Sorteren op"
      className="flex flex-col gap-2 small:flex-row small:flex-wrap small:items-center"
      data-testid={dataTestId}
    >
      <span className="eyebrow small:mr-2">Sorteren op</span>
      {sortOptions.map((o) => {
        const active = o.value === sortBy
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setQueryParams("sortBy", o.value)}
            className={clx(
              "h-10 rounded-circle px-4 text-left text-sm transition-colors small:text-center",
              active
                ? "bg-ink font-semibold text-paper"
                : "bg-bone text-ink hover:bg-grey-20"
            )}
            data-testid="radio-label"
            data-active={active}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

export default SortProducts
