import { forwardRef, useImperativeHandle, useMemo, useRef } from "react"

import NativeSelect, {
  NativeSelectProps,
} from "@modules/common/components/native-select"
import { HttpTypes } from "@medusajs/types"
import { CHECKOUT_COUNTRIES } from "@lib/util/shipping"

const CountrySelect = forwardRef<
  HTMLSelectElement,
  NativeSelectProps & {
    region?: HttpTypes.StoreRegion
  }
>(({ placeholder = "Land", region, defaultValue, ...props }, ref) => {
const innerRef = useRef<HTMLSelectElement>(null)

  useImperativeHandle<HTMLSelectElement | null, HTMLSelectElement | null>(
    ref,
    () => innerRef.current
  )

  const countryOptions = useMemo(() => {
    if (!region) {
      return []
    }

    // Alleen NL en BE, met Nederlandse labels; andere landen blijven verborgen.
    return region.countries
      ?.filter((country) => country.iso_2 && country.iso_2 in CHECKOUT_COUNTRIES)
      .map((country) => ({
        value: country.iso_2,
        label: CHECKOUT_COUNTRIES[country.iso_2!],
      }))
  }, [region])

  return (
    <NativeSelect
      ref={innerRef}
      placeholder={placeholder}
      defaultValue={defaultValue}
      {...props}
    >
      {countryOptions?.map(({ value, label }, index) => (
        <option key={index} value={value}>
          {label}
        </option>
      ))}
    </NativeSelect>
  )
})

CountrySelect.displayName = "CountrySelect"

export default CountrySelect
