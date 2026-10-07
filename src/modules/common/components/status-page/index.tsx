import { ReactNode } from "react"

// Pagina voor 404 en andere "geen inhoud"-situaties in de RC CHOICE-stijl.
export const primaryButtonClass =
  "inline-flex h-12 items-center justify-center rounded-circle bg-ink px-7 text-sm font-semibold text-paper transition-colors duration-200 hover:bg-grey-80"
export const secondaryButtonClass =
  "inline-flex h-12 items-center justify-center rounded-circle bg-bone px-7 text-sm font-semibold text-ink transition-colors duration-200 hover:bg-grey-20"

const StatusPage = ({
  code,
  eyebrow,
  title,
  text,
  children,
  testId,
}: {
  /** Groot decoratief getal, bv. "404". */
  code?: string
  eyebrow: string
  title: string
  text: string
  /** Knoppen (gebruik primaryButtonClass / secondaryButtonClass). */
  children?: ReactNode
  testId?: string
}) => (
  <section
    className="content-container flex min-h-[60vh] flex-col justify-center py-16 small:py-24"
    data-testid={testId}
  >
    {code && (
      <p
        aria-hidden="true"
        className="mb-2 select-none text-8xl font-semibold leading-none tracking-tight text-bone small:text-[10rem]"
      >
        {code}
      </p>
    )}
    <p className="eyebrow mb-2">{eyebrow}</p>
    <h1 className="text-3xl font-semibold tracking-tight text-ink small:text-5xl">
      {title}
    </h1>
    <p className="mt-4 max-w-xl text-base text-grey-70">{text}</p>
    {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
  </section>
)

export default StatusPage
