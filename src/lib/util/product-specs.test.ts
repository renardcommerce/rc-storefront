// Draaien: npm run test:specs
import assert from "node:assert/strict"
import { test } from "node:test"

import { getProductSpecs } from "./product-specs"
import { SPEC_CASES } from "./product-specs.cases"

const show = (p: Parameters<typeof getProductSpecs>[0]) =>
  getProductSpecs(p).map((s) => `${s.label}: ${s.value}`)

// Elk echt gemeld geval van shop.rcchoice.nl (05-10-2026).
for (const c of SPEC_CASES) {
  test(`geval ${c.nr}: ${c.title}`, () => {
    const description = c.description?.map((d) => `<li>${d}</li>`).join("")
    assert.deepEqual(show({ title: c.title, description }), c.expected)
  })
}

// Regressie: titeldelen gescheiden door " - " zijn geen lengtebereik.
test("streepje tussen titeldelen is geen bereik", () => {
  assert.deepEqual(show({ title: "Printerkabel - USB 2.0 - 5 Meter" }), [
    "Lengte: 5 m",
    "Versie: USB 2.0",
  ])
})

test("bereik, opsomming en tot/max geven geen lengte", () => {
  for (const title of [
    "HDMI kabel 1-3 m",
    "HDMI kabel 1 - 3 m",
    "HDMI kabel 1, 2 of 3 m",
    "HDMI kabel 1 / 2 / 3 m",
    "HDMI kabel tot 5 m",
  ]) {
    assert.ok(!show({ title }).some((s) => s.startsWith("Lengte")), title)
  }
})

test("versie alleen als x.y: 'HDMI 2 m' geeft geen versie", () => {
  assert.deepEqual(show({ title: "HDMI 2 m" }), ["Lengte: 2 m", "Aansluiting: HDMI"])
})

test("uitgesloten of variant-zinnen in de beschrijving tellen niet mee", () => {
  const description =
    "<p>Dit is geen HDMI kabel.</p><p>Verkrijgbaar in 1 meter, 2 meter en 5 meter.</p>"
  assert.deepEqual(show({ title: "Audiokabel", description }), [])
})

test("metadata wordt vertrouwd", () => {
  assert.deepEqual(
    show({ title: "Kabel", metadata: { lengte: "10 m", aansluiting: "XLR" } }),
    ["Lengte: 10 m", "Aansluiting: XLR"]
  )
})

test("niets herkend = leeg", () => {
  assert.deepEqual(show({ title: "Audiokabel premium" }), [])
})
