import { COMPANY, RETURN_ADDRESS } from "@lib/content/pages"
import { RETURN_COST_TEXT } from "@lib/content/returns"

export type ReturnSheetItem = { title: string; quantity: number; reason: string }

// Printbaar retourformulier (zie .print-sheet in globals.css).
const ReturnSheet = ({
  number,
  orderNumber,
  customerName,
  items,
}: {
  number: string
  orderNumber: string | number
  customerName: string
  items: ReturnSheetItem[]
}) => (
  <section className="print-sheet rounded-large border border-grey-20 p-5 small:p-8" data-testid="return-sheet">
    <p className="eyebrow mb-1">{COMPANY.brand}</p>
    <h2 className="text-2xl font-semibold tracking-tight text-ink">Retourformulier</h2>

    <dl className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3 text-sm small:grid-cols-2">
      <div>
        <dt className="text-grey-60">Retournummer</dt>
        <dd className="font-semibold text-ink" data-testid="return-number">{number}</dd>
      </div>
      <div>
        <dt className="text-grey-60">Bestelnummer</dt>
        <dd className="font-semibold text-ink">#{orderNumber}</dd>
      </div>
      <div>
        <dt className="text-grey-60">Klant</dt>
        <dd className="text-ink">{customerName}</dd>
      </div>
      <div>
        <dt className="text-grey-60">Retouradres</dt>
        <dd className="font-semibold text-ink" data-testid="return-address">
          {COMPANY.legalName}, {RETURN_ADDRESS}
        </dd>
      </div>
    </dl>

    <table className="mt-6 w-full text-left text-sm">
      <thead>
        <tr className="border-b border-grey-20 text-grey-60">
          <th className="py-2 pr-3 font-medium">Artikel</th>
          <th className="py-2 pr-3 font-medium">Aantal</th>
          <th className="py-2 font-medium">Reden</th>
        </tr>
      </thead>
      <tbody>
        {items.map((it, i) => (
          <tr key={i} className="border-b border-grey-20 align-top">
            <td className="py-2 pr-3 break-words text-ink">{it.title}</td>
            <td className="py-2 pr-3 text-ink">{it.quantity}</td>
            <td className="py-2 text-ink">{it.reason}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <p className="mt-6 text-sm text-ink">
      Stop dit formulier bij het pakket. {RETURN_COST_TEXT}
    </p>
    <p className="mt-3 text-xs text-grey-60">
      {COMPANY.legalName} · {COMPANY.email}
      {COMPANY.phone ? ` · ${COMPANY.phone}` : ""}
    </p>
  </section>
)

export default ReturnSheet
