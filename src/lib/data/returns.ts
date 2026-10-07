"use server"

import { sdk } from "@lib/config"
import { FALLBACK_RETURN_REASONS } from "@lib/content/returns"
import { isWithinReturnWindow, returnNumber } from "@lib/util/returns"
import { HttpTypes } from "@medusajs/types"
import { redirect } from "next/navigation"
import { getAuthHeaders } from "./cookies"

export type ReturnReasonOption = { value: string; label: string; reasonId?: string }

export type ReturnOrder = {
  order: HttpTypes.StoreOrder
  /** Datum waarop de bestelling is bezorgd; null als niet te bepalen. */
  deliveredAt: string | null
  eligible: boolean
}

// Laatste bezorgdatum uit de fulfillments, alleen als de bestelling als bezorgd is gemarkeerd.
function deliveredAtOf(order: any): string | null {
  const fulfillments: any[] = order?.fulfillments ?? []
  const dates = fulfillments
    .map((f) => f?.delivered_at)
    .filter(Boolean)
    .map((d: string) => new Date(d))
    .filter((d: Date) => !Number.isNaN(d.getTime()))
  if (!dates.length) return null
  const last = new Date(Math.max(...dates.map((d) => d.getTime())))
  return last.toISOString()
}

/**
 * Haalt de bestelling van de ingelogde klant op, met bezorgdatum.
 * Geeft null als de bestelling niet bestaat of niet van deze klant is.
 * Lukt het ophalen van fulfillments niet, dan valt het terug op de gewone bestelling
 * (bezorgdatum onbekend, dus niet retour-aanmeldbaar).
 */
export async function retrieveReturnOrder(id: string): Promise<ReturnOrder | null> {
  const headers = { ...(await getAuthHeaders()) }
  if (!("authorization" in headers)) return null

  const fetchOrder = (fields: string) =>
    sdk.client.fetch<HttpTypes.StoreOrderResponse>(`/store/orders/${id}`, {
      method: "GET",
      query: { fields },
      headers,
      cache: "no-store",
    })

  const base = "*items,*items.variant,*items.product,*shipping_address"
  let order: HttpTypes.StoreOrder | null = null
  try {
    order = (await fetchOrder(`${base},*fulfillments,+fulfillment_status`)).order
  } catch {
    try {
      order = (await fetchOrder(base)).order
    } catch {
      return null
    }
  }

  const deliveredAt = deliveredAtOf(order)
  const eligible =
    !!deliveredAt &&
    (order as any).fulfillment_status !== "canceled" &&
    isWithinReturnWindow(deliveredAt)
  return { order, deliveredAt, eligible }
}

/** Retourredenen uit Medusa (GET /store/return-reasons); anders de vaste lijst. */
export async function listReturnReasons(): Promise<ReturnReasonOption[]> {
  try {
    const { return_reasons } = await sdk.client.fetch<{
      return_reasons: { id: string; label: string }[]
    }>("/store/return-reasons", { method: "GET", cache: "no-store" })
    if (return_reasons?.length) {
      return return_reasons.map((r) => ({ value: r.id, label: r.label, reasonId: r.id }))
    }
  } catch {
    // val terug op de vaste lijst
  }
  return FALLBACK_RETURN_REASONS.map((label) => ({ value: label, label }))
}

/** Aantal bestaande retouren op de bestelling (voor het volgnummer); 0 als dat niet op te vragen is. */
async function countExistingReturns(id: string, headers: Record<string, string>): Promise<number> {
  try {
    const { order } = await sdk.client.fetch<{ order: any }>(`/store/orders/${id}`, {
      method: "GET",
      query: { fields: "id,*returns" },
      headers,
      cache: "no-store",
    })
    return Array.isArray(order?.returns) ? order.returns.length : 0
  } catch {
    return 0
  }
}

export type SubmitReturnState = { error: string | null }

/**
 * Server action: valideert de aanvraag opnieuw (eigen bestelling, leverdatum, venster, aantallen),
 * meldt de retour aan via POST /store/returns als RETURN_SHIPPING_OPTION_ID is ingesteld en
 * stuurt door naar de bevestigingspagina.
 */
export async function submitReturn(
  _state: SubmitReturnState,
  formData: FormData
): Promise<SubmitReturnState> {
  const orderId = String(formData.get("order_id") ?? "")
  const countryCode = String(formData.get("country_code") ?? "")
  const note = String(formData.get("note") ?? "").slice(0, 500)
  if (!orderId || !/^[a-z]{2}$/.test(countryCode)) {
    return { error: "Er ging iets mis. Probeer het opnieuw." }
  }

  const ro = await retrieveReturnOrder(orderId)
  if (!ro) return { error: "Bestelling niet gevonden." }
  if (!ro.eligible) {
    return { error: "Voor deze bestelling kun je geen retour meer aanmelden. Neem contact met ons op." }
  }

  const reasons = await listReturnReasons()
  const picked: { id: string; quantity: number; reason?: ReturnReasonOption }[] = []
  for (const item of ro.order.items ?? []) {
    if (formData.get(`select_${item.id}`) !== "on") continue
    const quantity = Number(formData.get(`qty_${item.id}`))
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > item.quantity) {
      return { error: `Kies een geldig aantal voor "${item.title}".` }
    }
    const reason = reasons.find((r) => r.value === String(formData.get(`reason_${item.id}`)))
    if (!reason) return { error: `Kies een reden voor "${item.title}".` }
    picked.push({ id: item.id, quantity, reason })
  }
  if (!picked.length) return { error: "Kies minstens één artikel." }

  const headers = { ...(await getAuthHeaders()) } as Record<string, string>
  const n = (await countExistingReturns(orderId, headers)) + 1
  const number = returnNumber(ro.order.display_id ?? "", n)

  let registered = false
  const optionId = process.env.RETURN_SHIPPING_OPTION_ID
  if (optionId) {
    try {
      await sdk.client.fetch("/store/returns", {
        method: "POST",
        headers,
        body: {
          order_id: orderId,
          items: picked.map((p) => ({
            id: p.id,
            quantity: p.quantity,
            reason_id: p.reason?.reasonId,
            note: p.reason?.label,
          })),
          return_shipping: { option_id: optionId },
          note: `${number}${note ? ` - ${note}` : ""}`,
        },
      })
      registered = true
    } catch (e) {
      console.error("Retour aanmelden mislukt:", e)
      return { error: "Het aanmelden is niet gelukt. Probeer het later opnieuw of mail ons." }
    }
  }

  const q = new URLSearchParams()
  q.set("n", String(n))
  q.set("reg", registered ? "1" : "0")
  for (const p of picked) q.append("i", `${p.id}:${p.quantity}:${p.reason?.label ?? ""}`)
  redirect(`/${countryCode}/account/orders/details/${orderId}/retour/bevestigd?${q.toString()}`)
}
