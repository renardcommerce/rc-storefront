import { ReactNode } from "react"

// Koptekst voor store-, categorie- en collectiepagina's: label, titel en
// (optioneel) het aantal producten.
const PageHeader = ({
  eyebrow,
  title,
  titleTestId,
  children,
}: {
  eyebrow: string
  title: string
  titleTestId?: string
  children?: ReactNode
}) => (
  <div className="mb-6 small:mb-8">
    <p className="eyebrow mb-2">{eyebrow}</p>
    <h1
      className="text-2xl small:text-4xl font-semibold tracking-tight text-ink"
      data-testid={titleTestId}
    >
      {title}
    </h1>
    {children}
  </div>
)

export default PageHeader
