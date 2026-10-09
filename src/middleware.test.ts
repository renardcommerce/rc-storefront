// Draaien: npm run test:specs
// Test de cookie-/redirectlogica van de middleware met een gemockte Medusa-regio-API.
import assert from "node:assert/strict"
import { before, test } from "node:test"

import { NextRequest } from "next/server"

type Middleware = typeof import("./middleware").middleware
let middleware: Middleware

before(async () => {
  process.env.MEDUSA_BACKEND_URL = "http://backend.test"
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY = "pk_test"
  process.env.NEXT_PUBLIC_DEFAULT_REGION = "nl"

  globalThis.fetch = (async () =>
    new Response(
      JSON.stringify({
        regions: [
          {
            id: "reg_nl",
            countries: [{ iso_2: "nl" }, { iso_2: "be" }],
          },
        ],
      }),
      { status: 200, headers: { "content-type": "application/json" } }
    )) as typeof fetch

  middleware = (await import("./middleware")).middleware
})

const req = (path: string, cookie?: string) =>
  new NextRequest(`https://shop.test${path}`, {
    headers: cookie ? { cookie } : {},
  })

test("zonder cookie op /nl/...: pagina renderen en cookie zetten, geen redirect", async () => {
  const res = await middleware(req("/nl/store?page=2"))

  assert.equal(res.status, 200)
  assert.equal(res.headers.get("location"), null)
  assert.equal(res.headers.get("x-middleware-next"), "1")

  const setCookie = res.headers.get("set-cookie") ?? ""
  assert.match(setCookie, /_medusa_cache_id=[0-9a-f-]{36}/)
  assert.match(setCookie, /Max-Age=86400/)
})

test("zonder cookie: het cache-id is ook zichtbaar voor de server-componenten van hetzelfde verzoek", async () => {
  const res = await middleware(req("/nl/products/abc"))
  const forwarded = res.headers.get("x-middleware-request-cookie") ?? ""
  const cookieHeader = res.headers.get("x-middleware-override-headers") ?? ""

  // Next geeft aangepaste verzoekheaders door via x-middleware-request-<naam>
  assert.match(cookieHeader, /cookie/)
  assert.match(forwarded, /_medusa_cache_id=[0-9a-f-]{36}/)
})

test("client die cookies niet bewaart komt nooit in een lus: elk verzoek geeft direct 200", async () => {
  for (let i = 0; i < 5; i++) {
    const res = await middleware(req("/nl/store"))
    assert.equal(res.status, 200)
    assert.equal(res.headers.get("location"), null)
  }
})

test("met cookie: doorgaan, geen nieuwe cookie", async () => {
  const res = await middleware(req("/nl/store", "_medusa_cache_id=abc"))

  assert.equal(res.status, 200)
  assert.equal(res.headers.get("x-middleware-next"), "1")
  assert.equal(res.headers.get("set-cookie"), null)
})

test("/be werkt hetzelfde als /nl", async () => {
  const res = await middleware(req("/be"))
  assert.equal(res.status, 200)
  assert.equal(res.headers.get("location"), null)
})

test("/ zonder landcode: nog steeds een enkele redirect naar de standaardregio", async () => {
  const res = await middleware(req("/"))

  assert.equal(res.status, 307)
  assert.equal(res.headers.get("location"), "https://shop.test/nl")
})

test("noindex-header blijft staan zolang NEXT_PUBLIC_SITE_INDEXABLE niet true is", async () => {
  const res = await middleware(req("/nl/store"))
  assert.equal(res.headers.get("x-robots-tag"), "noindex, nofollow")
})
