// Draaien: npm run test:specs
import assert from "node:assert/strict"
import { test } from "node:test"

import { stripBrand, titleWithBrand } from "./brand"

test("merk uit categorienaam, in elke schrijfwijze", () => {
  assert.equal(stripBrand("RC Choice HDMI kabels"), "HDMI kabels")
  assert.equal(stripBrand("HDMI kabels RC CHOICE"), "HDMI kabels")
  assert.equal(stripBrand("HDMI kabels - RC Choice"), "HDMI kabels")
  assert.equal(stripBrand("RC-Choice USB | RC Choice"), "USB")
})

test("naam zonder merk blijft gelijk; alleen het merk blijft over als de naam zelf", () => {
  assert.equal(stripBrand("HDMI kabels"), "HDMI kabels")
  assert.equal(stripBrand("RC Choice"), "RC Choice")
  assert.equal(stripBrand(null), "")
  assert.equal(stripBrand(undefined), "")
})

test("woorden die lijken op het merk blijven staan", () => {
  assert.equal(stripBrand("Choice kabels"), "Choice kabels")
})

test("titel: merk één keer", () => {
  assert.equal(titleWithBrand("HDMI kabels"), "HDMI kabels | RC Choice")
  assert.equal(titleWithBrand("RC Choice HDMI"), "RC Choice HDMI")
  assert.equal(titleWithBrand("HDMI kabels | RC Choice"), "HDMI kabels | RC Choice")
})
