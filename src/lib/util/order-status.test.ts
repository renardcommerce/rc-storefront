// Draaien: npm run test:specs
import assert from "node:assert/strict"
import { test } from "node:test"

import { formatStatus, UNKNOWN_STATUS_LABEL } from "./order-status"

test("bekende statussen krijgen een Nederlands label", () => {
  assert.equal(formatStatus("delivered"), "Bezorgd")
  assert.equal(formatStatus("captured"), "Betaald")
  assert.equal(formatStatus("not_fulfilled"), "Nog niet verwerkt")
})

test("undefined, null, leeg of geen tekst crasht niet en geeft 'Onbekend'", () => {
  for (const v of [undefined, null, "", "   ", 5, {}, []]) {
    assert.equal(formatStatus(v), UNKNOWN_STATUS_LABEL)
  }
})

test("onbekende status wordt leesbaar gemaakt", () => {
  assert.equal(formatStatus("on_hold"), "On hold")
})

test("namen van Object-eigenschappen geven geen interne waarde terug", () => {
  assert.equal(formatStatus("constructor"), "Constructor")
  assert.equal(formatStatus("toString"), "ToString")
})
