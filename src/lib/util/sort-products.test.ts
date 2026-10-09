// Draaien: npm run test:specs
import assert from "node:assert/strict"
import { test } from "node:test"

import { sortProducts } from "./sort-products"

// Voorbeelden, geen echte producten.
const p = (id: string, created_at: string, price?: number): any => ({
  id,
  created_at,
  variants: price === undefined ? [] : [{ calculated_price: { calculated_amount: price } }],
})

const ids = (list: any[]) => list.map((x) => x.id)

test("gelijke prijs: volgorde hangt niet af van de invoervolgorde", () => {
  const a = p("a", "2026-01-02T00:00:00Z", 10)
  const b = p("b", "2026-01-02T00:00:00Z", 10)
  const c = p("c", "2026-01-03T00:00:00Z", 10)
  const x = ids(sortProducts([a, b, c], "price_asc"))
  const y = ids(sortProducts([c, b, a], "price_asc"))
  const z = ids(sortProducts([b, c, a], "price_asc"))
  assert.deepEqual(x, ["c", "a", "b"])
  assert.deepEqual(y, x)
  assert.deepEqual(z, x)
})

test("prijs oplopend en aflopend; gelijke prijs houdt dezelfde onderlinge volgorde", () => {
  const list = [p("a", "2026-01-01T00:00:00Z", 20), p("b", "2026-01-01T00:00:00Z", 10), p("c", "2026-01-02T00:00:00Z", 20)]
  assert.deepEqual(ids(sortProducts([...list], "price_asc")), ["b", "c", "a"])
  assert.deepEqual(ids(sortProducts([...list], "price_desc")), ["c", "a", "b"])
})

test("producten zonder varianten (Infinity) komen achteraan en geven geen NaN-volgorde", () => {
  const list = [p("a", "2026-01-01T00:00:00Z"), p("b", "2026-01-02T00:00:00Z"), p("c", "2026-01-01T00:00:00Z", 5)]
  assert.deepEqual(ids(sortProducts([...list], "price_asc")), ["c", "b", "a"])
  assert.deepEqual(ids(sortProducts([...list].reverse(), "price_asc")), ["c", "b", "a"])
})

test("nieuwste eerst; gelijke tijd op id", () => {
  const list = [p("b", "2026-01-01T00:00:00Z"), p("a", "2026-01-01T00:00:00Z"), p("c", "2026-02-01T00:00:00Z")]
  assert.deepEqual(ids(sortProducts([...list], "created_at")), ["c", "a", "b"])
  assert.deepEqual(ids(sortProducts([...list].reverse(), "created_at")), ["c", "a", "b"])
})

test("pagina's sluiten aan: elk product precies één keer", () => {
  const list = Array.from({ length: 30 }, (_, i) => p(`id${i}`, "2026-01-01T00:00:00Z", i % 3))
  const shuffled = [...list].sort(() => 0.5 - Math.random())
  const sorted = ids(sortProducts(shuffled, "price_asc"))
  const pages = [sorted.slice(0, 12), sorted.slice(12, 24), sorted.slice(24)]
  assert.equal(new Set(pages.flat()).size, 30)
  assert.deepEqual(sorted, ids(sortProducts([...list], "price_asc")))
})
