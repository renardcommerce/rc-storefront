import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const STATUS_LABELS: Record<string, string> = {
  // bezorgstatus
  not_fulfilled: "Nog niet verwerkt",
  partially_fulfilled: "Gedeeltelijk verwerkt",
  fulfilled: "Verwerkt",
  partially_shipped: "Gedeeltelijk verzonden",
  shipped: "Verzonden",
  partially_delivered: "Gedeeltelijk bezorgd",
  delivered: "Bezorgd",
  canceled: "Geannuleerd",
  // betaalstatus
  not_paid: "Niet betaald",
  awaiting: "In afwachting",
  authorized: "Goedgekeurd",
  partially_authorized: "Gedeeltelijk goedgekeurd",
  captured: "Betaald",
  partially_captured: "Gedeeltelijk betaald",
  partially_refunded: "Gedeeltelijk terugbetaald",
  refunded: "Terugbetaald",
  requires_action: "Actie vereist",
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const formatStatus = (str: string) => {
    if (STATUS_LABELS[str]) {
      return STATUS_LABELS[str]
    }

    const formatted = str.split("_").join(" ")

    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
  }

  return (
    <div>
      <Text>
        We hebben de orderbevestiging gestuurd naar{" "}
        <span
          className="text-ui-fg-medium-plus font-semibold"
          data-testid="order-email"
        >
          {order.email}
        </span>
        .
      </Text>
      <Text className="mt-2">
        Besteldatum:{" "}
        <span data-testid="order-date">
          {new Date(order.created_at).toLocaleDateString("nl-NL")}
        </span>
      </Text>
      <Text className="mt-2 text-ui-fg-interactive">
        Bestelnummer: <span data-testid="order-id">{order.display_id}</span>
      </Text>

      <div className="flex items-center text-compact-small gap-x-4 mt-4">
        {showStatus && (
          <>
            <Text>
              Bestelstatus:{" "}
              <span className="text-ui-fg-subtle " data-testid="order-status">
                {formatStatus(order.fulfillment_status)}
              </span>
            </Text>
            <Text>
              Betaalstatus:{" "}
              <span
                className="text-ui-fg-subtle "
                sata-testid="order-payment-status"
              >
                {formatStatus(order.payment_status)}
              </span>
            </Text>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderDetails
