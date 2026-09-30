import { forwardRef, useImperativeHandle, useMemo, useRef } from "react"

import NativeSelect, {
  NativeSelectProps,
} from "@modules/common/components/native-select"
import { HttpTypes } from "@medusajs/types"

const CountrySelect = forwardRef<
  HTMLSelectElement,
  NativeSelectProps & {
    region?: HttpTypes.StoreRegion
  }
>(({ placeholder = "Land", region, defaultValue, value, ...props }, ref) => {
const innerRef = useRef<HTMLSelectElement>(null)

  useImperativeHandle<HTMLSelectElement | null, HTMLSelectElement | null>(
    ref,
    () => innerRef.current
  )

  const countryOptions = useMemo(() => {
    if (!region) {
      return []
    }

    // Alleen Nederland, met Nederlands label (geen dubbele/Engelse namen).
    return region.countries
      ?.filter((country) => country.iso_2 === "nl")
      .map((country) => ({
        value: country.iso_2,
        label: "Nederland",
      }))
  }, [region])

  // Opgeslagen adres met een ander land dan NL: val terug op NL, anders
  // heeft de select geen passende optie en blijft hij leeg.
  const toAvailable = <T,>(v: T): T | string => {
    if (!v || !countryOptions?.length) return v
    const known = countryOptions.some((o) => o.value === String(v).toLowerCase())
    return known ? v : countryOptions[0].value!
  }

  return (
    <NativeSelect
      ref={innerRef}
      placeholder={placeholder}
      defaultValue={toAvailable(defaultValue)}
      value={value === undefined ? undefined : toAvailable(value)}
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
