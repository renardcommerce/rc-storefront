"use client"

const PrintButton = () => (
  <button
    type="button"
    onClick={() => window.print()}
    className="inline-flex h-12 items-center rounded-circle bg-ink px-7 text-sm font-semibold text-paper transition-colors hover:bg-grey-80"
    data-testid="print-return"
  >
    Retourformulier printen
  </button>
)

export default PrintButton
