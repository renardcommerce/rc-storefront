// Draaien: npm run test:specs
import assert from "node:assert/strict"
import { test } from "node:test"

import {
  isWithinReturnWindow,
  RETURN_WINDOW_DAYS,
  returnDeadline,
  returnNumber,
} from "./returns"

const d = (s: string) => new Date(s)

test("venster is 14 dagen (constante)", () => {
  assert.equal(RETURN_WINDOW_DAYS, 14)
})

test("op de leverdag en tot en met dag 14: binnen het venster", () => {
  const delivered = d("2026-10-01T10:00:00Z")
  assert.equal(isWithinReturnWindow(delivered, d("2026-10-01T23:59:00Z")), true)
  assert.equal(isWithinReturnWindow(delivered, d("2026-10-10T08:00:00Z")), true)
  assert.equal(isWithinReturnWindow(delivered, d("2026-10-15T23:59:59Z")), true)
})

test("dag 15 of later: buiten het venster", () => {
  const delivered = d("2026-10-01T10:00:00Z")
  assert.equal(isWithinReturnWindow(delivered, d("2026-10-16T00:00:00Z")), false)
  assert.equal(isWithinReturnWindow(delivered, d("2027-01-01T00:00:00Z")), false)
})

test("leverdatum in de toekomst, leeg of ongeldig: niet binnen het venster", () => {
  const now = d("2026-10-05T12:00:00Z")
  assert.equal(isWithinReturnWindow(d("2026-10-06T00:00:00Z"), now), false)
  assert.equal(isWithinReturnWindow(null, now), false)
  assert.equal(isWithinReturnWindow(undefined, now), false)
  assert.equal(isWithinReturnWindow("geen datum", now), false)
})

test("datum als string en afwijkend venster", () => {
  const now = d("2026-10-05T12:00:00Z")
  assert.equal(isWithinReturnWindow("2026-09-25T09:00:00Z", now), true)
  assert.equal(isWithinReturnWindow("2026-09-25T09:00:00Z", now, 7), false)
})

test("uiterste datum = leverdag + 14 dagen", () => {
  assert.equal(returnDeadline(d("2026-10-01T10:00:00Z")).toISOString().slice(0, 10), "2026-10-15")
  assert.equal(returnDeadline(d("2026-12-25T10:00:00Z")).toISOString().slice(0, 10), "2027-01-08")
})

test("retournummer: RC-RET-<bestelnummer>-<n>", () => {
  assert.equal(returnNumber(1042), "RC-RET-1042-1")
  assert.equal(returnNumber("1042", 3), "RC-RET-1042-3")
})

test("retournummer: ongeldige invoer geeft een fout", () => {
  assert.throws(() => returnNumber("", 1))
  assert.throws(() => returnNumber("10 42", 1))
  assert.throws(() => returnNumber(1042, 0))
  assert.throws(() => returnNumber(1042, 1.5))
})
