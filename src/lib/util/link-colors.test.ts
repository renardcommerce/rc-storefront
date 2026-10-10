// Draaien: npm run test:specs
import assert from "node:assert/strict"
import { test } from "node:test"

import { ACCOUNT_LINK_COLOR, contrastRatio } from "./link-colors"

test("contrastverhouding: zwart/wit is 21, gelijke kleuren 1", () => {
  assert.equal(Math.round(contrastRatio("#000000", "#ffffff")), 21)
  assert.equal(contrastRatio("#123456", "#123456"), 1)
})

test("linkkleur op de accountpagina's haalt 4,5:1 op wit", () => {
  assert.ok(contrastRatio(ACCOUNT_LINK_COLOR, "#ffffff") >= 4.5, String(contrastRatio(ACCOUNT_LINK_COLOR, "#ffffff")))
})

test("de oude kleur haalde het niet (blauw #3b82f6 op wit)", () => {
  assert.ok(contrastRatio("#3b82f6", "#ffffff") < 4.5)
})
