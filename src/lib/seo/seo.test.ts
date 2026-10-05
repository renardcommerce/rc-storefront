// Draaien: npm run test:specs
import assert from "node:assert/strict"
import { test } from "node:test"

import { breadcrumbJsonLd, canonicalPath, metaText, seoPage, seoTitle } from "./index"

test("titel: merknaam, paginanummer pas vanaf pagina 2", () => {
  assert.equal(seoTitle("Alle producten"), "Alle producten | RC Choice")
  assert.equal(seoTitle("Alle producten", 1), "Alle producten | RC Choice")
  assert.equal(seoTitle("Alle producten", 3), "Alle producten – pagina 3 | RC Choice")
})

test("canonical: zonder ?page= op pagina 1, met ?page= vanaf 2", () => {
  assert.equal(canonicalPath("/nl/store"), "/nl/store")
  assert.equal(canonicalPath("/nl/store", 1), "/nl/store")
  assert.equal(canonicalPath("/nl/categories/hdmi", 2), "/nl/categories/hdmi?page=2")
})

test("metaText: HTML eruit, fallback bij leeg, max 155 tekens", () => {
  assert.equal(metaText("<p>Dit &amp; dat</p>", "x"), "Dit & dat")
  assert.equal(metaText(null, "Fallback"), "Fallback")
  assert.equal(metaText("   ", "Fallback"), "Fallback")
  const long = metaText("a".repeat(300), "x")
  assert.equal(long.length, 155)
  assert.ok(long.endsWith("..."))
})

test("BreadcrumbList: posities en absolute URL's", () => {
  const ld = breadcrumbJsonLd(
    [
      { name: "Home", path: "/nl" },
      { name: "Alle producten", path: "/nl/store" },
    ],
    "https://example.test/"
  )
  assert.equal(ld["@type"], "BreadcrumbList")
  assert.deepEqual(ld.itemListElement, [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://example.test/nl" },
    { "@type": "ListItem", position: 2, name: "Alle producten", item: "https://example.test/nl/store" },
  ])
})

test("seoPage: ongeldig of 1 geeft 1", () => {
  assert.equal(seoPage(undefined), 1)
  for (const raw of ["0", "-1", "abc", "2.5", "", "1"]) assert.equal(seoPage(raw), 1, raw)
  assert.equal(seoPage(["2", "3"]), 1)
  assert.equal(seoPage("15"), 15)
})
