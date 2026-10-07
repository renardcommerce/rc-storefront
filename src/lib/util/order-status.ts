// Nederlandse labels voor bezorg- en betaalstatus van een bestelling.

export const STATUS_LABELS: Record<string, string> = {
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

export const UNKNOWN_STATUS_LABEL = "Onbekend"

/** Label voor een status; veilig bij undefined, null, lege of niet-tekst waarden. */
export function formatStatus(status: unknown): string {
  if (typeof status !== "string" || !status.trim()) return UNKNOWN_STATUS_LABEL
  if (Object.prototype.hasOwnProperty.call(STATUS_LABELS, status)) {
    return STATUS_LABELS[status]
  }
  const formatted = status.trim().split("_").join(" ")
  return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
}
