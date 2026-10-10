// Draaien: npm run test:specs
import assert from "node:assert/strict"
import { test } from "node:test"

import { CONTENT_PAGES, LEVERTIJD } from "./pages"

const pageText = (slug: string) =>
  CONTENT_PAGES[slug].blocks
    .map((b) => ("text" in b ? b.text : "items" in b ? b.items.join(" ") : ""))
    .join("\n")

test("levertijd: één waarde, zichtbaar op verzending, FAQ en voorwaarden", () => {
  assert.equal(LEVERTIJD, "2 tot 4 werkdagen")
  for (const slug of ["verzending", "faq", "algemene-voorwaarden"]) {
    assert.ok(
      pageText(slug).includes(`De levertijd is ${LEVERTIJD}.`),
      `${slug}: zin met levertijd ontbreekt`
    )
  }
})

test("het token [LEVERTIJD] verschijnt nergens meer", () => {
  for (const slug of Object.keys(CONTENT_PAGES)) {
    assert.ok(!pageText(slug).includes("[LEVERTIJD]"), `${slug}: [LEVERTIJD] zichtbaar`)
  }
})
