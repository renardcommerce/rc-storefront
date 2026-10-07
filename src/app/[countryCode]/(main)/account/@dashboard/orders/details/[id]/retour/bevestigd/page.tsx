import { Metadata } from "next"
import { notFound } from "next/navigation"

import { retrieveCustomer } from "@lib/data/customer"
import { retrieveReturnOrder } from "@lib/data/returns"
import { returnNumber } from "@lib/util/returns"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import PrintButton from "@modules/returns/components/print-button"
import ReturnSheet, { ReturnSheetItem } from "@modules/returns/components/return-sheet"

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ n?: string; reg?: string; i?: string | string[] }>
}

export const metadata: Metadata = {
  title: "Retour aangemeld",
  description: "Bevestiging van je retour en printbaar retourformulier.",
}

export default async function ReturnConfirmedPage(props: Props) {
  const { id } = await props.params
  const sp = await props.searchParams

  const ro = await retrieveReturnOrder(id)
  if (!ro) notFound()

  const n = Number(sp.n)
  const rawItems = Array.isArray(sp.i) ? sp.i : sp.i ? [sp.i] : []

  // Alleen regels tonen die echt in de bestelling zitten; aantallen begrensd op het bestelde aantal.
  const items: ReturnSheetItem[] = []
  for (const raw of rawItems) {
    const [itemId, qty, ...reason] = raw.split(":")
    const item = ro.order.items?.find((it) => it.id === itemId)
    const quantity = Number(qty)
    if (!item || !Number.isInteger(quantity) || quantity < 1 || quantity > item.quantity) continue
    items.push({ title: item.title, quantity, reason: reason.join(":").slice(0, 100) || "-" })
  }

  let number: string
  try {
    number = returnNumber(ro.order.display_id ?? "", n)
  } catch {
    notFound()
  }
  if (!items.length) notFound()

  const customer = await retrieveCustomer().catch(() => null)
  const addr = ro.order.shipping_address
  const customerName =
    [customer?.first_name, customer?.last_name].filter(Boolean).join(" ") ||
    [addr?.first_name, addr?.last_name].filter(Boolean).join(" ") ||
    ro.order.email ||
    "-"
  const registered = sp.reg === "1"

  return (
    <div className="flex flex-col gap-y-6" data-testid="return-confirmed">
      <div>
        <p className="eyebrow mb-2">Bestelling #{ro.order.display_id}</p>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          {registered ? "Je retour is aangemeld" : "Je retourformulier staat klaar"}
        </h1>
        <p className="mt-2 text-sm text-grey-70" data-testid="return-status-text">
          {registered
            ? "We hebben je aanvraag ontvangen. Print het formulier, stop het bij het pakket en stuur het naar het retouradres."
            : "Let op: deze aanvraag is nog niet automatisch bij ons geregistreerd. Mail het retournummer en dit formulier naar ons, dan verwerken we je retour."}
        </p>
      </div>

      <ReturnSheet number={number} orderNumber={ro.order.display_id ?? "-"} customerName={customerName} items={items} />

      <div className="flex flex-wrap items-center gap-4 print:hidden">
        <PrintButton />
        <LocalizedClientLink href="/account/orders" className="text-sm text-grey-60 underline hover:text-ink">
          Terug naar bestellingen
        </LocalizedClientLink>
      </div>
    </div>
  )
}
