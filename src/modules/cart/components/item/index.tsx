"use client"

import { Trash } from "lucide-react"
import { clx } from "@medusajs/ui"
import { deleteLineItem, updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import ErrorMessage from "@modules/checkout/components/error-message"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import { useState } from "react"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
}

const MAX_QUANTITY = 10

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)

    await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setUpdating(false)
      })
  }

  const handleDelete = async () => {
    setDeleting(true)
    await deleteLineItem(item.id).catch(() => setDeleting(false))
  }

  const isFull = type === "full"

  return (
    <li
      className="flex w-full gap-x-4 py-4 first:pt-0 last:pb-0"
      data-testid="product-row"
    >
      <LocalizedClientLink
        href={`/products/${item.product_handle}`}
        className={clx("shrink-0", isFull ? "w-20 small:w-24" : "w-16")}
      >
        <Thumbnail
          thumbnail={item.thumbnail}
          images={item.variant?.product?.images}
          size="square"
          className="!p-0"
        />
      </LocalizedClientLink>

      <div className="flex min-w-0 flex-1 flex-col gap-y-2">
        <div className="flex items-start justify-between gap-x-3">
          <div className="min-w-0">
            <p
              className="break-words text-sm font-medium text-ink"
              data-testid="product-title"
            >
              {item.product_title}
            </p>
            {item.variant?.title && item.variant.title !== "Default" && (
              <p
                className="mt-0.5 text-xs text-grey-60"
                data-testid="product-variant"
              >
                Variant: {item.variant.title}
              </p>
            )}
            {isFull && (
              <div className="mt-1 text-xs text-grey-60">
                <LineItemUnitPrice
                  item={item}
                  style="tight"
                  currencyCode={currencyCode}
                />
              </div>
            )}
          </div>
          <div className="shrink-0 whitespace-nowrap text-sm font-semibold text-ink">
            {!isFull && (
              <p className="text-right text-xs font-normal text-grey-60">
                {item.quantity}×
              </p>
            )}
            <LineItemPrice
              item={item}
              style="tight"
              currencyCode={currencyCode}
            />
          </div>
        </div>

        {isFull && (
          <div className="flex items-center gap-x-4">
            <label className="sr-only" htmlFor={`qty-${item.id}`}>
              Aantal
            </label>
            <select
              id={`qty-${item.id}`}
              value={item.quantity}
              onChange={(e) => changeQuantity(parseInt(e.target.value))}
              disabled={updating || deleting}
              className="h-10 rounded-circle border border-bone bg-paper px-4 text-sm text-ink"
              data-testid="product-select-button"
            >
              {Array.from(
                { length: Math.max(MAX_QUANTITY, item.quantity) },
                (_, i) => (
                  <option value={i + 1} key={i}>
                    {i + 1}
                  </option>
                )
              )}
            </select>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-x-1.5 text-sm text-grey-60 hover:text-ink"
              data-testid="product-delete-button"
            >
              {deleting ? <Spinner /> : <Trash size={16} aria-hidden="true" />}
              Verwijderen
            </button>
            {updating && <Spinner />}
          </div>
        )}
        <ErrorMessage error={error} data-testid="product-error-message" />
      </div>
    </li>
  )
}

export default Item
