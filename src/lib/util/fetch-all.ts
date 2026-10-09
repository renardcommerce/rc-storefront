// Haalt een complete lijst op via offset-pagina's en geeft elk product precies één keer terug.
//
// Achtergrond: pagineren met offset op een niet-uniek sorteerveld (veel gelijke created_at)
// kan per verzoek een andere volgorde geven, waardoor producten dubbel of niet voorkomen.
// Daarom halen we de lijst in één keer op (dedupe op id) en pagineren we lokaal.

export type PageResult<P> = { products: P[]; count: number }

export type FetchPage<P> = (offset: number, limit: number) => Promise<PageResult<P>>

export type FetchAllResult<P> = {
  products: P[]
  /** Totaal volgens de API. */
  count: number
  /** false als na een tweede poging nog producten ontbreken (instabiele API-volgorde op de paginagrens). */
  complete: boolean
}

async function fetchPages<P>(fetchPage: FetchPage<P>, size: number) {
  const first = await fetchPage(0, size)
  const extra = Math.max(0, Math.ceil(first.count / size) - 1)
  const rest = await Promise.all(
    Array.from({ length: extra }, (_, i) => fetchPage((i + 1) * size, size))
  )
  return { items: [first, ...rest].flatMap((r) => r.products), count: first.count }
}

export async function fetchAllUnique<P extends { id: string }>(
  fetchPage: FetchPage<P>,
  pageSize = 100
): Promise<FetchAllResult<P>> {
  const byId = new Map<string, P>()
  const add = (items: P[]) => items.forEach((p) => byId.has(p.id) || byId.set(p.id, p))

  const a = await fetchPages(fetchPage, pageSize)
  add(a.items)

  // Ontbreken er producten (gelijke sorteerwaarde op de paginagrens), dan nog één keer met
  // een andere paginagrootte, zodat de grenzen ergens anders liggen, en de resultaten samenvoegen.
  if (byId.size < a.count && pageSize > 1) {
    const b = await fetchPages(fetchPage, pageSize - 1)
    add(b.items)
  }

  return { products: [...byId.values()], count: a.count, complete: byId.size >= a.count }
}

/** Lokale paginering (page >= 1). */
export function paginate<T>(list: T[], page: number, perPage: number): T[] {
  const start = (Math.max(1, page) - 1) * perPage
  return list.slice(start, start + perPage)
}
