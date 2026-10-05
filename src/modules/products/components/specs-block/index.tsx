import { HttpTypes } from "@medusajs/types"
import { getProductSpecs } from "@lib/util/product-specs"

// Toont alleen velden waarvan de data in het product staat; geen data = geen blok.
const SpecsBlock = ({ product }: { product: HttpTypes.StoreProduct }) => {
  const specs = getProductSpecs(product)
  if (!specs.length) return null

  return (
    <section
      className="rounded-large bg-white p-5 shadow-card"
      data-testid="specs-block"
    >
      <h2 className="eyebrow mb-2">Specificaties</h2>
      <dl className="text-sm divide-y divide-bone">
        {specs.map(({ label, value }) => (
          <div key={label} className="flex justify-between gap-x-4 py-2">
            <dt className="text-grey-60">{label}</dt>
            <dd className="text-right font-medium text-ink">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export default SpecsBlock
