import { HttpTypes } from "@medusajs/types"

export type ProductSpec = { label: string; value: string }

type SpecSource = Pick<
  HttpTypes.StoreProduct,
  "title" | "description" | "subtitle" | "metadata"
>

/*
 * Principe: liever een leeg veld dan een fout veld. Een waarde wordt alleen
 * getoond als de bron er één ondubbelzinnige waarde voor geeft. Bij twijfel
 * (meerdere verschillende waarden, bereik, "tot/max", adapter met twee
 * uiteinden die niet allebei herkend zijn) komt het veld niet in de lijst.
 *
 * Volgorde van bronnen: metadata (expliciet, altijd vertrouwd) > titel >
 * subtitel > beschrijving. De eerste bron die iets zegt beslist; geeft die
 * bron twijfel, dan wordt er niet doorgezocht in een zwakkere bron.
 */

const stripHtml = (s?: string | null) =>
  (s ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim()

const meta = (p: SpecSource, keys: string[]): string | undefined => {
  for (const key of keys) {
    const v = p.metadata?.[key]
    if (typeof v === "string" && v.trim()) return v.trim()
    if (typeof v === "number") return String(v)
  }
  return undefined
}

// Resultaat per bron: een waarde, "twijfel" (stop met zoeken), of niets.
type Found<T> = { value: T } | "doubt" | null

// ---------- aansluitingen ----------

type Conn = { re: string; name: string }

// Herkenbare aansluitingen, specifiekste eerst (eerste treffer wint per positie).
const CONNECTORS: Conn[] = [
  { re: "mini[\\s-]?hdmi", name: "Mini HDMI" },
  { re: "micro[\\s-]?hdmi", name: "Micro HDMI" },
  { re: "hdmi", name: "HDMI" },
  { re: "mini[\\s-]?(?:displayport|display[\\s-]?port|dp)", name: "Mini DisplayPort" },
  { re: "display[\\s-]?port|dp", name: "DisplayPort" },
  { re: "usb[\\s-]?c|type[\\s-]?c", name: "USB-C" },
  { re: "usb[\\s-]?a", name: "USB-A" },
  { re: "usb[\\s-]?b", name: "USB-B" },
  { re: "toslink|optisch(?:e)?", name: "Toslink (optisch)" },
  { re: "xlr", name: "XLR" },
  { re: "rca|cinch|tulp", name: "RCA (tulp)" },
  { re: "3[.,]5\\s?mm(?:\\s?jack)?", name: "3,5 mm jack" },
  { re: "vga", name: "VGA" },
  { re: "dvi", name: "DVI" },
  { re: "rj\\s?45", name: "RJ45" },
]

// Genoemd maar niet eenduidig (welke USB? welke jack?). Aanwezigheid = twijfel.
const AMBIGUOUS = "usb|micro[\\s-]?usb|mini[\\s-]?usb|lightning|jack|scart|firewire|thunderbolt|serieel|parallel|centronics|ethernet"

const CONN_RE = new RegExp(
  `(?<![\\w])(?:${CONNECTORS.map((c, i) => `(?<c${i}>${c.re})`).join("|")}|(?<amb>${AMBIGUOUS}))(?![\\w])`,
  "gi"
)

// Woorden waaruit blijkt dat de twee uiteinden verschillen (of kunnen verschillen).
const TWO_END_WORDS =
  /\b(adapter|verloop\w*|converter|omvormer|splitter|switch|printer\w*|naar|to|zu)\b|[→>]|\bkabel\s+voor\b/i

// "<aansluiting> naar|to|→ <aansluiting>"
const SEP = "(?:\\s+(?:naar|to)\\s+|\\s*(?:->|→|>)\\s*)"

type Scan = { names: string[]; ambiguous: boolean }

function scanConnectors(text: string): Scan {
  const names: string[] = []
  let ambiguous = false
  for (const m of text.matchAll(CONN_RE)) {
    const g = m.groups ?? {}
    if (g.amb) {
      ambiguous = true
      continue
    }
    const idx = CONNECTORS.findIndex((_, i) => g[`c${i}`] !== undefined)
    if (idx >= 0) names.push(CONNECTORS[idx].name)
  }
  return { names, ambiguous }
}

function connectorFrom(text: string): Found<string> {
  if (!text) return null
  const scan = scanConnectors(text)
  if (!scan.names.length && !scan.ambiguous) return null

  if (TWO_END_WORDS.test(text)) {
    // Twee uiteinden: alleen tonen als de tekst exact "A naar B" zegt en
    // beide kanten herkend zijn.
    const pair = text.match(new RegExp(`(.{0,25}?)${SEP}(.{0,25})`, "i"))
    if (!pair || scan.ambiguous) return "doubt"
    const left = scanConnectors(pair[1].split(/[,(]/).pop() ?? "")
    const right = scanConnectors((pair[2] ?? "").split(/[,)]/)[0])
    // zoek de aansluiting direct links en rechts van het scheidingswoord
    const leftName = left.names[left.names.length - 1]
    const rightName = right.names[0]
    if (leftName && rightName && !left.ambiguous && !right.ambiguous) {
      return { value: `${leftName} naar ${rightName}` }
    }
    return "doubt"
  }

  if (scan.ambiguous) return "doubt"
  const distinct = [...new Set(scan.names)]
  return distinct.length === 1 ? { value: distinct[0] } : "doubt"
}

// ---------- lengte ----------

// Doubtful: bereik, "tot/max/vanaf", per meter, of gevolgd door "/" (m/s).
const LENGTH_RE =
  /(?<pre>(?:tot(?:\s+en\s+met)?|max(?:imaal)?\.?|vanaf|per|[-–/])\s*)?(?<![\d.,])(?<num>\d{1,3}(?:[.,]\d{1,2})?)\s?(?<unit>meter|cm|m)(?![\w/])/gi

function lengthFrom(text: string): Found<string> {
  if (!text) return null
  const found = new Set<string>()
  let doubt = false
  for (const m of text.matchAll(LENGTH_RE)) {
    const before = text.slice(Math.max(0, (m.index ?? 0) - 8), m.index)
    // "HDMI 2.0 m"-achtig: getal hoort bij een versie, niet bij een lengte
    if (/[.,]/.test(m.groups!.num) && /(?:hdmi|dp|usb|displayport)\s?v?$/i.test(before)) continue
    if (m.groups?.pre) {
      doubt = true
      continue
    }
    // bereik of opsomming vóór het getal: "1 - 3 m", "1 / 2 / 3 m", "1, 2 of 3 m"
    if (/(?:\d\s?(?:m|cm|meter)?\s?(?:[-–/]|of|en|,)\s?)$/i.test(before)) {
      doubt = true
      continue
    }
    const num = m.groups!.num.replace(".", ",")
    found.add(m.groups!.unit.toLowerCase() === "cm" ? `${num} cm` : `${num} m`)
  }
  if (doubt || found.size > 1) return "doubt"
  return found.size === 1 ? { value: [...found][0] } : null
}

// ---------- versie ----------

// Alleen "<standaard> <x.y>" met punt; losse "v2" of "versie 2" is te vaag.
const VERSION_RE =
  /(?<![\w])(?<fam>hdmi|display[\s-]?port|dp|usb)\s?v?(?<ver>\d\.\d)(?![\d.]*\s?(?:m|cm|meter)(?![\w/]))(?![\w])/gi

function versionFrom(text: string): Found<string> {
  if (!text) return null
  const found = new Set<string>()
  for (const m of text.matchAll(VERSION_RE)) {
    const f = m.groups!.fam.toLowerCase()
    const fam = f === "hdmi" ? "HDMI" : f === "usb" ? "USB" : "DisplayPort"
    found.add(`${fam} ${m.groups!.ver}`)
  }
  if (found.size > 1) return "doubt"
  return found.size === 1 ? { value: [...found][0] } : null
}

// ---------- samenstellen ----------

function pick<T>(sources: string[], fn: (t: string) => Found<T>): T | undefined {
  for (const s of sources) {
    const r = fn(s)
    if (r === "doubt") return undefined
    if (r) return r.value
  }
  return undefined
}

/**
 * Lengte, aansluiting en versie. Zie het principe bovenaan: alleen zekere
 * waarden, anders geen veld.
 */
export function getProductSpecs(p: SpecSource): ProductSpec[] {
  const title = stripHtml(p.title)
  const sources = [title, stripHtml(p.subtitle), stripHtml(p.description)]

  // Heeft het product twee verschillende uiteinden volgens titel/subtitel?
  // Dan zegt een versie niets over "het" product: laat versie weg.
  const twoEnded = TWO_END_WORDS.test(`${sources[0]} ${sources[1]}`)

  const length = meta(p, ["lengte", "length"]) ?? pick(sources, lengthFrom)
  const connector =
    meta(p, ["aansluiting", "connector", "connectors"]) ??
    pick(sources, connectorFrom)
  const version =
    meta(p, ["versie", "version"]) ??
    (twoEnded ? undefined : pick(sources, versionFrom))

  const specs: ProductSpec[] = []
  if (length) specs.push({ label: "Lengte", value: length })
  if (connector) specs.push({ label: "Aansluiting", value: connector })
  if (version) specs.push({ label: "Versie", value: version })
  return specs
}
