import { HttpTypes } from "@medusajs/types"
import { Heading } from "@medusajs/ui"
import { sanitizeDescription } from "@lib/util/sanitize-description"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="eyebrow hover:text-ink"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}
        <Heading
          level="h1"
          className="text-2xl small:text-3xl font-semibold leading-tight tracking-tight text-ink"
          data-testid="product-title"
        >
          {product.title}
        </Heading>

        <div
          className="product-description text-base text-grey-70"
          data-testid="product-description"
          dangerouslySetInnerHTML={{
            __html: sanitizeDescription(product.description),
          }}
        />
      </div>
    </div>
  )
}

export default ProductInfo
