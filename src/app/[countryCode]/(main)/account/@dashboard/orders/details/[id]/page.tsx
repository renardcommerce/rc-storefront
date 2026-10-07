import { retrieveOrder } from "@lib/data/orders"
import { retrieveReturnOrder } from "@lib/data/returns"
import OrderDetailsTemplate from "@modules/order/templates/order-details-template"
import { Metadata } from "next"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const order = await retrieveOrder(params.id).catch(() => null)

  if (!order) {
    notFound()
  }

  return {
    title: `Bestelling #${order.display_id}`,
    description: "Bekijk je bestelling",
  }
}

export default async function OrderDetailPage(props: Props) {
  const params = await props.params
  const order = await retrieveOrder(params.id).catch(() => null)

  if (!order) {
    notFound()
  }

  const returnEligible = await retrieveReturnOrder(params.id)
    .then((r) => !!r?.eligible)
    .catch(() => false)

  return <OrderDetailsTemplate order={order} returnEligible={returnEligible} />
}
