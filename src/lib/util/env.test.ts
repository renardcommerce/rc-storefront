// Draaien: npm run test:specs
import assert from "node:assert/strict"
import { afterEach, test } from "node:test"

import { getBaseURL } from "./env"

const env = process.env as Record<string, string | undefined>
const ORIGINAL = { base: env.NEXT_PUBLIC_BASE_URL, node: env.NODE_ENV }

afterEach(() => {
  env.NEXT_PUBLIC_BASE_URL = ORIGINAL.base
  env.NODE_ENV = ORIGINAL.node
})

test("waarde uit NEXT_PUBLIC_BASE_URL, zonder slash aan het eind", () => {
  env.NODE_ENV = "production"
  env.NEXT_PUBLIC_BASE_URL = "https://shop.rcchoice.nl"
  assert.equal(getBaseURL(), "https://shop.rcchoice.nl")
  env.NEXT_PUBLIC_BASE_URL = "https://shop.rcchoice.nl//"
  assert.equal(getBaseURL(), "https://shop.rcchoice.nl")
  env.NEXT_PUBLIC_BASE_URL = "  https://shop.rcchoice.nl/ "
  assert.equal(getBaseURL(), "https://shop.rcchoice.nl")
})

test("productie zonder waarde: duidelijke fout, geen stille localhost", () => {
  env.NODE_ENV = "production"
  delete env.NEXT_PUBLIC_BASE_URL
  assert.throws(() => getBaseURL(), /NEXT_PUBLIC_BASE_URL ontbreekt/)
  env.NEXT_PUBLIC_BASE_URL = "   "
  assert.throws(() => getBaseURL(), /NEXT_PUBLIC_BASE_URL ontbreekt/)
})

test("ontwikkeling zonder waarde: localhost (http, zoals next dev)", () => {
  env.NODE_ENV = "development"
  delete env.NEXT_PUBLIC_BASE_URL
  assert.equal(getBaseURL(), "http://localhost:8000")
})
