"use client"

import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

import { FREE_SHIPPING_TEXT } from "@lib/util/shipping"
import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const tabs = [
    {
      label: "Productinformatie",
      component: <ProductInfoTab product={product} />,
    },
    {
      label: "Verzending & retourneren",
      component: <ShippingInfoTab />,
    },
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  const ean = product.variants?.[0]?.barcode || product.variants?.[0]?.sku

  const specs: [string, string][] = [
    ["Merk", "RC Choice"],
    ["EAN", ean || "-"],
    ["Materiaal", product.material || "-"],
    ["Gewicht", product.weight ? `${product.weight} g` : "-"],
    [
      "Afmetingen verpakking",
      product.length && product.width && product.height
        ? `${product.length} x ${product.width} x ${product.height} mm`
        : "-",
    ],
    [
      "Land van herkomst",
      product.origin_country ? product.origin_country.toUpperCase() : "-",
    ],
  ]

  return (
    <dl className="text-sm py-4 divide-y divide-bone">
      {specs.map(([label, value]) => (
        <div key={label} className="flex justify-between gap-x-4 py-2.5">
          <dt className="text-grey-60">{label}</dt>
          <dd className="text-right font-medium text-ink">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

const ShippingInfoTab = () => {
  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-1 gap-y-8">
        <div className="flex items-start gap-x-2">
          <FastDelivery />
          <div>
            <span className="font-semibold">{FREE_SHIPPING_TEXT}</span>
            <p className="max-w-sm">
              Je bestelling wordt zorgvuldig verpakt en verzonden. Zodra je
              pakket onderweg is, ontvang je een track &amp; trace-code.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Back />
          <div>
            <span className="font-semibold">14 dagen bedenktijd</span>
            <p className="max-w-sm">
              Niet tevreden? Je kunt je aankoop binnen 14 dagen na ontvangst
              herroepen. De kosten van het terugsturen zijn voor jouw rekening.{" "}
              <LocalizedClientLink href="/content/retourneren" className="underline">
                Bekijk de retourvoorwaarden
              </LocalizedClientLink>
              .
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Refresh />
          <div>
            <span className="font-semibold">Vragen?</span>
            <p className="max-w-sm">
              Twijfel je welke kabel je nodig hebt?{" "}
              <LocalizedClientLink href="/content/contact" className="underline">
                Neem contact met ons op
              </LocalizedClientLink>
              , we helpen je graag.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
