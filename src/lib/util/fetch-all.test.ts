// Draaien: npm run test:specs
import assert from "node:assert/strict"
import { test } from "node:test"

import { fetchAllUnique, paginate } from "./fetch-all"
import { sortProducts } from "./sort-products"

// Voorbeelden, geen echte producten: 166 producten waarvan 30 met identieke created_at.
type P = { id: string; created_at: string; variants: any[] }
const SAME = "2026-03-01T00:00:00Z"
const make = (n: number, same: number): P[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `prod_${String(i).padStart(3, "0")}`,
    created_at: i < same ? SAME : new Date(Date.UTC(2026, 0, 1) + i * 3600e3).toISOString(),
    variants: [{ calculated_price: { calculated_amount: 5 + (i % 7) } }],
  }))

// Nep-API: "-created_at" met bij gelijke created_at per verzoek een andere (willekeurige) volgorde,
// precies het gedrag dat dubbele en ontbrekende producten gaf.
const unstableApi = (all: P[], calls?: { n: number }) => async (offset: number, limit: number) => {
  if (calls) calls.n++
  const salt = Math.random()
  const list = all
    .map((x) => ({ x, r: x.created_at === SAME ? Math.random() + salt : 0 }))
    .sort((a, b) => (a.x.created_at < b.x.created_at ? 1 : a.x.created_at > b.x.created_at ? -1 : a.r - b.r))
    .map((o) => o.x)
  return { products: list.slice(offset, offset + limit), count: list.length }
}

const pagesOf = (list: P[], per = 12) =>
  Array.from({ length: Math.ceil(list.length / per) }, (_, i) => paginate(list, i + 1, per))

test("oude aanpak (offset per pagina op gelijke created_at) geeft dubbele en ontbrekende producten", () => {
  // reproduceert het probleem: elke pagina krijgt een eigen volgorde van de 30 gelijke producten
  const all = make(166, 30)
  const api = unstableApi(all)
  return Promise.all(Array.from({ length: 14 }, (_, i) => api(i * 12, 12))).then((pages) => {
    const ids = pages.flatMap((p) => p.products.map((x) => x.id))
    assert.ok(new Set(ids).size < 166, "verwacht ontbrekende producten bij de oude aanpak")
    assert.ok(ids.length > new Set(ids).size, "verwacht dubbele producten bij de oude aanpak")
  })
})

for (const sortBy of ["created_at", "price_asc", "price_desc"] as const) {
  test(`${sortBy}: 14 pagina's samen = alle 166 producten, geen overlap (30 gelijke created_at)`, async () => {
    const all = make(166, 30)
    for (let run = 0; run < 20; run++) {
      const { products, count, complete } = await fetchAllUnique(unstableApi(all), 100)
      assert.equal(count, 166)
      assert.equal(complete, true)
      const pages = pagesOf(sortProducts(products as any, sortBy) as P[])
      assert.equal(pages.length, 14)
      const ids = pages.flat().map((p) => p.id)
      assert.equal(ids.length, 166)
      assert.equal(new Set(ids).size, 166)
      assert.deepEqual([...ids].sort(), all.map((p) => p.id).sort())
    }
  })
}

test("volgorde is bij elke run gelijk (deterministisch)", async () => {
  const all = make(166, 30)
  const order = async () => {
    const { products } = await fetchAllUnique(unstableApi(all), 100)
    return (sortProducts(products as any, "created_at") as P[]).map((p) => p.id).join(",")
  }
  const first = await order()
  for (let i = 0; i < 10; i++) assert.equal(await order(), first)
})

test("alle gelijke created_at op de paginagrens (positie 95-125): tweede poging vult aan, nooit dubbel", async () => {
  // 40 gelijke producten midden in de lijst, dus op de grens tussen API-pagina 1 en 2
  const all: P[] = Array.from({ length: 166 }, (_, i) => ({
    id: `prod_${String(i).padStart(3, "0")}`,
    created_at: i >= 95 && i < 135 ? SAME : new Date(Date.UTC(2026, 0, 1) + (i < 95 ? 1000 - i : 500 - i) * 3600e3).toISOString(),
    variants: [],
  }))
  for (let run = 0; run < 30; run++) {
    const r = await fetchAllUnique(unstableApi(all), 100)
    const ids = r.products.map((p) => p.id)
    assert.equal(new Set(ids).size, ids.length, "nooit dubbel")
    assert.equal(r.complete, ids.length >= 166)
    assert.ok(ids.length >= 100)
  }
})

test("aantal verzoeken: 166 producten = 2 verzoeken (pagina's van 100) bij een stabiele API", async () => {
  const all = make(166, 0)
  const calls = { n: 0 }
  const r = await fetchAllUnique(unstableApi(all, calls), 100)
  assert.equal(r.complete, true)
  assert.equal(calls.n, 2)
})

test("kleine lijst: 1 verzoek; lege lijst: 1 verzoek, geen producten", async () => {
  const calls = { n: 0 }
  const r = await fetchAllUnique(unstableApi(make(40, 10), calls), 100)
  assert.equal(r.products.length, 40)
  assert.equal(calls.n, 1)
  const e = await fetchAllUnique(unstableApi([], { n: 0 }), 100)
  assert.deepEqual(e, { products: [], count: 0, complete: true })
})

test("fout van de API wordt doorgegeven (de aanroeper doet retry en toont de foutmelding)", async () => {
  await assert.rejects(
    fetchAllUnique(async () => {
      throw new Error("502")
    }),
    /502/
  )
})

test("paginate: pagina buiten bereik is leeg, pagina < 1 telt als 1", () => {
  const list = [1, 2, 3, 4, 5]
  assert.deepEqual(paginate(list, 1, 2), [1, 2])
  assert.deepEqual(paginate(list, 3, 2), [5])
  assert.deepEqual(paginate(list, 4, 2), [])
  assert.deepEqual(paginate(list, 0, 2), [1, 2])
})
