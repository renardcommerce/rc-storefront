"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams, usePathname, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import TierDiscount from "../tier-discount"
import { FREE_SHIPPING_TEXT } from "@lib/util/shipping"
import MobileActions from "./mobile-actions"
import { useRouter } from "next/navigation"

const MAX_QUANTITY = 99

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  disabled,
}: ProductActionsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const countryCode = useParams().countryCode as string

  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const value = isValidVariant ? selectedVariant?.id : null

    if (params.get("v_id") === value) {
      return
    }

    if (value) {
      params.set("v_id", value)
    } else {
      params.delete("v_id")
    }

    router.replace(pathname + "?" + params.toString())
  }, [selectedVariant, isValidVariant])

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }

    // If we allow back orders on the variant, we can add to cart
    if (selectedVariant?.allow_backorder) {
      return true
    }

    // If there is inventory available, we can add to cart
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }

    // Otherwise, we can't add to cart
    return false
  }, [selectedVariant])

  // EAN: alleen tonen als de (gekozen of enige) variant een barcode heeft.
  const eanVariant =
    selectedVariant ??
    (product.variants?.length === 1 ? product.variants[0] : undefined)
  const ean = eanVariant?.barcode || undefined
  const brand =
    (product.metadata?.brand as string | undefined) ||
    (product.metadata?.merk as string | undefined) ||
    "RC Choice"

  const actionsRef = useRef<HTMLDivElement>(null)

  const inView = useIntersection(actionsRef, "0px")

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)

    await addToCart({
      variantId: selectedVariant.id,
      quantity,
      countryCode,
    })

    setIsAdding(false)
  }

  return (
    <>
      <div
        className="flex flex-col gap-y-2 rounded-large bg-white p-5 small:p-6 shadow-card"
        ref={actionsRef}
      >
        <div>
          {(product.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-4">
              {(product.options || []).map((option) => {
                return (
                  <div key={option.id}>
                    <OptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={setOptionValue}
                      title={option.title ?? ""}
                      data-testid="product-options"
                      disabled={!!disabled || isAdding}
                    />
                  </div>
                )
              })}
              <Divider />
            </div>
          )}
        </div>

        <ProductPrice product={product} variant={selectedVariant} />

        <TierDiscount />

        <div className="flex items-center gap-x-3 mt-2">
          <div
            className="flex items-center rounded-circle border border-bone bg-paper"
            role="group"
            aria-label="Aantal"
          >
            <button
              type="button"
              className="h-10 w-10 text-lg disabled:opacity-40"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={!!disabled || isAdding || quantity <= 1}
              aria-label="Minder"
              data-testid="quantity-decrease"
            >
              −
            </button>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={MAX_QUANTITY}
              value={quantity}
              onChange={(e) => {
                const n = parseInt(e.target.value, 10)
                setQuantity(
                  Number.isNaN(n) ? 1 : Math.min(MAX_QUANTITY, Math.max(1, n))
                )
              }}
              disabled={!!disabled || isAdding}
              aria-label="Aantal"
              className="h-10 w-12 text-center bg-transparent [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              data-testid="quantity-input"
            />
            <button
              type="button"
              className="h-10 w-10 text-lg disabled:opacity-40"
              onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
              disabled={!!disabled || isAdding || quantity >= MAX_QUANTITY}
              aria-label="Meer"
              data-testid="quantity-increase"
            >
              +
            </button>
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={
              !inStock ||
              !selectedVariant ||
              !!disabled ||
              isAdding ||
              !isValidVariant
            }
            variant="primary"
            className="flex-1 h-10 !rounded-circle !bg-ink !text-paper hover:!bg-grey-80 !shadow-none !border-0"
            isLoading={isAdding}
            data-testid="add-product-button"
          >
            {!selectedVariant && !options
              ? "Selecteer variant"
              : !inStock || !isValidVariant
              ? "Niet op voorraad"
              : "In winkelwagen"}
          </Button>
        </div>

        <ul
          className="mt-4 flex flex-col gap-y-2 text-sm text-grey-70"
          data-testid="product-usps"
        >
          <li><span aria-hidden="true">✓</span> {FREE_SHIPPING_TEXT}</li>
          <li><span aria-hidden="true">✓</span> 14 dagen bedenktijd</li>
          <li className="pt-2 mt-1 border-t border-bone">
            Merk: <span className="text-ui-fg-base">{brand}</span>
          </li>
          {ean && (
            <li>
              EAN: <span className="text-ui-fg-base">{ean}</span>
            </li>
          )}
        </ul>
        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>
    </>
  )
}
