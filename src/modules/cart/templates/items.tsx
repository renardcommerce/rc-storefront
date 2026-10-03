import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items
  return (
    <ul className="flex flex-col divide-y divide-bone" data-testid="items-table">
      {items
        ? [...items]
            .sort((a, b) => ((a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1))
            .map((item) => (
              <Item
                key={item.id}
                item={item}
                currencyCode={cart?.currency_code ?? ""}
              />
            ))
        : repeat(5).map((i) => <SkeletonLineItem key={i} />)}
    </ul>
  )
}

export default ItemsTemplate
