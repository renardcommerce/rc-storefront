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

  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-2 gap-x-8">
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold">Merk</span>
            <p>RC Choice</p>
          </div>
          <div>
            <span className="font-semibold">EAN</span>
            <p>{ean ? ean : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">Materiaal</span>
            <p>{product.material ? product.material : "-"}</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold">Gewicht</span>
            <p>{product.weight ? `${product.weight} g` : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">Afmetingen verpakking</span>
            <p>
              {product.length && product.width && product.height
                ? `${product.length} x ${product.width} x ${product.height} mm`
                : "-"}
            </p>
          </div>
          <div>
            <span className="font-semibold">Land van herkomst</span>
            <p>{product.origin_country ? product.origin_country.toUpperCase() : "-"}</p>
          </div>
        </div>
      </div>
    </div>
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
