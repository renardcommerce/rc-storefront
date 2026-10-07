"use client"

import { FormEvent, startTransition, useActionState } from "react"

import { submitReturn, ReturnReasonOption } from "@lib/data/returns"
import { RETURN_COST_TEXT } from "@lib/content/returns"
import { HttpTypes } from "@medusajs/types"

const field =
  "h-11 w-full rounded-large border border-grey-20 bg-paper px-3 text-sm text-ink focus:border-ink focus:outline-none"

const ReturnForm = ({
  order,
  reasons,
  countryCode,
}: {
  order: HttpTypes.StoreOrder
  reasons: ReturnReasonOption[]
  countryCode: string
}) => {
  const [state, formAction, pending] = useActionState(submitReturn, { error: null })

  // Eigen submit i.p.v. action={...}: React 19 leegt het formulier na elke actie,
  // waardoor een klant bij een foutmelding alle keuzes kwijt zou zijn.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    startTransition(() => formAction(data))
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-y-6" data-testid="return-form">
      <input type="hidden" name="order_id" value={order.id} />
      <input type="hidden" name="country_code" value={countryCode} />

      <ul className="flex flex-col gap-y-4">
        {order.items?.map((item) => (
          <li key={item.id} className="rounded-large border border-grey-20 p-4" data-testid="return-item">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                name={`select_${item.id}`}
                className="mt-1 h-5 w-5 shrink-0 accent-[#111]"
              />
              <span className="min-w-0 text-sm font-semibold text-ink break-words">
                {item.title}
                {item.variant_title && item.variant_title !== "Default" ? ` – ${item.variant_title}` : ""}
              </span>
            </label>
            <div className="mt-3 grid grid-cols-1 gap-3 small:grid-cols-[120px_1fr]">
              <label className="text-xs text-grey-60">
                Aantal
                <select name={`qty_${item.id}`} defaultValue={item.quantity} className={`${field} mt-1`}>
                  {Array.from({ length: item.quantity }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs text-grey-60">
                Reden
                <select name={`reason_${item.id}`} defaultValue="" className={`${field} mt-1`}>
                  <option value="" disabled>
                    Kies een reden
                  </option>
                  {reasons.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </li>
        ))}
      </ul>

      <label className="text-xs text-grey-60">
        Toelichting (optioneel)
        <textarea name="note" rows={3} maxLength={500} className={`${field} mt-1 h-auto py-2`} />
      </label>

      <p className="text-sm text-grey-70">{RETURN_COST_TEXT}</p>

      {state.error && (
        <p role="alert" className="text-sm text-rose-600" data-testid="return-error">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 w-fit items-center rounded-circle bg-ink px-7 text-sm font-semibold text-paper transition-colors hover:bg-grey-80 disabled:opacity-60"
        data-testid="return-submit"
      >
        {pending ? "Bezig…" : "Retour aanmelden"}
      </button>
    </form>
  )
}

export default ReturnForm
