// Draaien: npm run test:specs
import assert from "node:assert/strict"
import { test } from "node:test"

import {
  buildPageUrl,
  getLastPage,
  pageRedirectTarget,
  parsePageParam,
} from "./pagination"

test("geen page-param: pagina 1, geldig", () => {
  assert.deepEqual(parsePageParam(undefined), { page: 1, valid: true })
})

test("geldige waarden blijven staan", () => {
  assert.deepEqual(parsePageParam("1"), { page: 1, valid: true })
  assert.deepEqual(parsePageParam("15"), { page: 15, valid: true })
})

test("ongeldige waarden (0, negatief, tekst, decimaal, leeg, lijst) geven pagina 1 + ongeldig", () => {
  for (const raw of ["0", "-1", "abc", "3abc", "2.5", "", " 2", "1e3", "99999999999999999999", ["1", "2"]]) {
    assert.deepEqual(parsePageParam(raw as string), { page: 1, valid: false }, String(raw))
  }
})

test("laatste pagina", () => {
  assert.equal(getLastPage(0, 12), 1)
  assert.equal(getLastPage(1, 12), 1)
  assert.equal(getLastPage(12, 12), 1)
  assert.equal(getLastPage(13, 12), 2)
  assert.equal(getLastPage(100, 12), 9)
})

test("pagina boven laatste pagina verwijst naar de laatste pagina", () => {
  assert.equal(pageRedirectTarget(15, 100, 12), 9)
  assert.equal(pageRedirectTarget(10, 100, 12), 9)
  assert.equal(pageRedirectTarget(9, 100, 12), null)
  assert.equal(pageRedirectTarget(1, 100, 12), null)
})

test("zonder resultaten: pagina 1 blijft, hogere pagina gaat naar 1 (geen redirect-lus)", () => {
  assert.equal(pageRedirectTarget(1, 0, 12), null)
  assert.equal(pageRedirectTarget(3, 0, 12), 1)
})

test("buildPageUrl behoudt overige parameters en laat ?page= weg bij pagina 1", () => {
  assert.equal(buildPageUrl("/nl/store", { page: "15" }, 9), "/nl/store?page=9")
  assert.equal(buildPageUrl("/nl/store", { page: "x" }, 1), "/nl/store")
  assert.equal(
    buildPageUrl("/nl/store", { sortBy: "price_asc", q: "hdmi kabel", page: "99" }, 4),
    "/nl/store?sortBy=price_asc&q=hdmi+kabel&page=4"
  )
  assert.equal(buildPageUrl("/nl/categories/a/b", { sortBy: "created_at" }, 1), "/nl/categories/a/b?sortBy=created_at")
})
