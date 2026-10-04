import { HttpTypes } from "@medusajs/types"

export type ProductSpec = { label: string; value: string }

type SpecSource = Pick<
  HttpTypes.StoreProduct,
  "title" | "description" | "subtitle" | "metadata"
>

const meta = (p: SpecSource, keys: string[]): string | undefined => {
  for (const key of keys) {
    const v = p.metadata?.[key]
    if (typeof v === "string" && v.trim()) return v.trim()
    if (typeof v === "number") return String(v)
  }
  return undefined
}

const stripHtml = (s?: string | null) =>
  (s ?? "").replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ")

// Bekende aansluitingen. Volgorde: specifiekste eerst.
const CONNECTORS: [RegExp, string][] = [
  [/\bmini[\s-]?hdmi\b/i, "Mini HDMI"],
  [/\bmicro[\s-]?hdmi\b/i, "Micro HDMI"],
  [/\bhdmi\b/i, "HDMI"],
  [/\bmini[\s-]?displayport\b/i, "Mini DisplayPort"],
  [/\bdisplay[\s-]?port\b/i, "DisplayPort"],
  [/\busb[\s-]?c\b/i, "USB-C"],
  [/\btoslink\b|\boptisch\b/i, "Toslink (optisch)"],
  [/\bxlr\b/i, "XLR"],
  [/\brca\b|\bcinch\b/i, "RCA (tulp)"],
  [/\b3[.,]5\s?mm\b/i, "3,5 mm jack"],
  [/\bvga\b/i, "VGA"],
  [/\bdvi\b/i, "DVI"],
]

// "2 m", "1,5 meter", "50 cm". Alleen als er een eenheid achter staat.
const LENGTH_RE = /(?<![\d.,])(\d{1,3}(?:[.,]\d{1,2})?)\s?(m|meter|cm)\b/i

const VERSION_RE =
  /\b(?:(hdmi|displayport|dp|usb)\s?v?(\d(?:\.\d)?)|v(?:ersie)?\s?(\d(?:\.\d)?))\b/i

function parseLength(text: string): string | undefined {
  const m = text.match(LENGTH_RE)
  if (!m) return undefined
  const num = m[1].replace(".", ",")
  return m[2].toLowerCase() === "cm" ? `${num} cm` : `${num} m`
}

function parseVersion(text: string): string | undefined {
  const m = text.match(VERSION_RE)
  if (!m) return undefined
  if (m[1] && m[2]) {
    const name = m[1].toLowerCase() === "dp" ? "DisplayPort" : m[1].toUpperCase()
    return `${name === "DISPLAYPORT" ? "DisplayPort" : name} ${m[2]}`
  }
  return m[3] ? `Versie ${m[3]}` : undefined
}

/**
 * Lengte, aansluiting en versie. Alleen velden waarvan de data echt in het
 * product staat: eerst metadata, anders titel, daarna beschrijving. Ontbreekt
 * iets, dan komt het veld niet in de lijst.
 */
export function getProductSpecs(p: SpecSource): ProductSpec[] {
  const sources = [p.title ?? "", stripHtml(p.subtitle), stripHtml(p.description)]

  const find = <T,>(fn: (text: string) => T | undefined) => {
    for (const s of sources) {
      const r = fn(s)
      if (r) return r
    }
    return undefined
  }

  const length =
    meta(p, ["lengte", "length"]) ?? find(parseLength)
  const connector =
    meta(p, ["aansluiting", "connector", "connectors"]) ??
    find((t) => CONNECTORS.find(([re]) => re.test(t))?.[1])
  const version =
    meta(p, ["versie", "version"]) ?? find(parseVersion)

  const specs: ProductSpec[] = []
  if (length) specs.push({ label: "Lengte", value: length })
  if (connector) specs.push({ label: "Aansluiting", value: connector })
  if (version) specs.push({ label: "Versie", value: version })
  return specs
}
