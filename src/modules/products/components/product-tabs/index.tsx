"use client"


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

export default ProductTabs
