import sanitizeHtml from "sanitize-html"

const ALLOWED_TAGS = [
  "p",
  "br",
  "ul",
  "ol",
  "li",
  "h2",
  "h3",
  "h4",
  "strong",
  "b",
  "em",
  "i",
  "a",
]

/**
 * Maakt een productbeschrijving veilig om als HTML te renderen.
 * Alleen een kleine whitelist aan tags; geen scripts, styles of event handlers.
 * Dubbel geëscapete HTML (&lt;p&gt;...) wordt eenmalig gedecodeerd.
 */
export function sanitizeDescription(raw?: string | null): string {
  if (!raw) return ""

  let html = raw
  if (!/<[a-z][\s\S]*>/i.test(html) && /&lt;\/?[a-z]/i.test(html)) {
    html = html
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#0?39;/g, "'")
      .replace(/&amp;/g, "&")
  }

  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: { a: ["href", "title"] },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer nofollow",
        target: "_blank",
      }),
    },
  })
}
