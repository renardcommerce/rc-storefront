import { Metadata } from "next"
import { notFound } from "next/navigation"

import { CONCEPT_LABEL, CONTENT_PAGES, SHOW_CONCEPT_LABEL } from "@lib/content/pages"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Props = {
  params: Promise<{ countryCode: string; slug: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params
  const page = CONTENT_PAGES[slug]

  if (!page) {
    return {}
  }

  return {
    title: `${page.title} | RC Choice`,
    description: page.description,
  }
}

export default async function ContentPage(props: Props) {
  const { slug } = await props.params
  const page = CONTENT_PAGES[slug]

  if (!page) {
    notFound()
  }

  return (
    <div className="content-container py-12 small:py-16" data-testid="content-page">
      <div className="max-w-2xl mx-auto flex flex-col gap-y-4 text-base-regular text-ui-fg-base">
        {SHOW_CONCEPT_LABEL && (
          <div
            className="border border-ui-border-base bg-ui-bg-subtle rounded-rounded px-4 py-2 txt-small-plus uppercase text-ui-fg-base"
            data-testid="concept-label"
          >
            {CONCEPT_LABEL}
          </div>
        )}
        <h1 className="text-2xl-semi mb-2">{page.title}</h1>
        {page.blocks.map((block, i) => {
          if (block.type === "h") {
            return (
              <h2 key={i} className="text-large-semi mt-4">
                {block.text}
              </h2>
            )
          }
          if (block.type === "ul") {
            return (
              <ul key={i} className="list-disc pl-5 flex flex-col gap-y-1">
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            )
          }
          if (block.type === "link") {
            return (
              <LocalizedClientLink
                key={i}
                href={block.href}
                className="inline-flex h-12 w-fit items-center rounded-circle bg-ink px-7 text-sm font-semibold text-paper transition-colors hover:bg-grey-80"
                data-testid="content-link"
              >
                {block.text}
              </LocalizedClientLink>
            )
          }
          return (
            <p key={i} className="leading-relaxed">
              {block.text}
            </p>
          )
        })}
        <div className="mt-8 pt-6 border-t border-ui-border-base txt-small text-ui-fg-subtle flex flex-wrap gap-x-4 gap-y-2">
          {Object.entries(CONTENT_PAGES).map(([key, p]) => (
            <LocalizedClientLink
              key={key}
              href={`/content/${key}`}
              className="hover:text-ui-fg-base underline"
            >
              {p.title}
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </div>
  )
}
