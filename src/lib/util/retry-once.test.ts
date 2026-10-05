// Draaien: npm run test:specs
import assert from "node:assert/strict"
import { test } from "node:test"

import { retryOnce } from "./retry-once"

const httpError = (status: number) => Object.assign(new Error("fout"), { status })

const flaky = (errors: unknown[]) => {
  let calls = 0
  const fn = async () => {
    const error = errors[calls++]
    if (error) throw error
    return "ok"
  }
  return { fn, calls: () => calls }
}

test("1x mislukt (502), dan gelukt: resultaat, 2 pogingen", async () => {
  const f = flaky([httpError(502)])
  assert.equal(await retryOnce(f.fn), "ok")
  assert.equal(f.calls(), 2)
})

test("netwerkfout wordt één keer opnieuw geprobeerd", async () => {
  const f = flaky([new TypeError("fetch failed")])
  assert.equal(await retryOnce(f.fn), "ok")
  assert.equal(f.calls(), 2)
})

test("2x mislukt (504): fout, precies 2 pogingen", async () => {
  const f = flaky([httpError(504), httpError(504), httpError(504)])
  await assert.rejects(retryOnce(f.fn), { status: 504 })
  assert.equal(f.calls(), 2)
})

test("404 is geen storing: geen nieuwe poging", async () => {
  const f = flaky([httpError(404)])
  await assert.rejects(retryOnce(f.fn), { status: 404 })
  assert.equal(f.calls(), 1)
})

test("direct gelukt: 1 poging", async () => {
  const f = flaky([])
  assert.equal(await retryOnce(f.fn), "ok")
  assert.equal(f.calls(), 1)
})
