// Draaien: npm run test:specs
import assert from "node:assert/strict"
import { test } from "node:test"

import {
  AUTH_MESSAGES,
  authErrorLogLine,
  classifyAuthError,
  loginErrorMessage,
  signupErrorMessage,
} from "./auth-errors"

// Zo gooit de Medusa-SDK: FetchError(message uit de backend, statusText, status)
const fetchError = (message: string, status: number) =>
  Object.assign(new Error(message), { status, statusText: "x" })

test("inloggen: verkeerde combinatie wordt een vriendelijke Nederlandse zin", () => {
  const e = fetchError("Invalid email or password", 401)
  assert.equal(classifyAuthError(e), "invalid_credentials")
  assert.equal(loginErrorMessage(e), AUTH_MESSAGES.invalid_credentials)
  assert.equal(loginErrorMessage(fetchError("Unauthorized", 401)), AUTH_MESSAGES.invalid_credentials)
  // alleen een 401 zonder tekst
  assert.equal(loginErrorMessage(fetchError("", 401)), AUTH_MESSAGES.invalid_credentials)
})

test("registreren: bestaand e-mailadres, ook al is het een 401", () => {
  const e = fetchError("Identity with email already exists", 401)
  assert.equal(classifyAuthError(e), "email_exists")
  assert.equal(signupErrorMessage(e), AUTH_MESSAGES.email_exists)
})

test("registreren: te zwak wachtwoord", () => {
  assert.equal(signupErrorMessage(fetchError("Password is too short", 400)), AUTH_MESSAGES.weak_password)
  assert.equal(
    signupErrorMessage(fetchError("Password must be at least 8 characters", 400)),
    AUTH_MESSAGES.weak_password
  )
})

test("ongeldig e-mailadres en te veel pogingen", () => {
  assert.equal(signupErrorMessage(fetchError("Invalid email format", 400)), AUTH_MESSAGES.invalid_email)
  assert.equal(loginErrorMessage(fetchError("Too many requests", 429)), AUTH_MESSAGES.rate_limited)
  assert.equal(signupErrorMessage(fetchError("", 429)), AUTH_MESSAGES.rate_limited)
})

test("onbekende fouten geven een algemene zin, zonder technische details", () => {
  const bad = [
    fetchError("Cannot read properties of undefined (reading 'foo')", 500),
    new Error("fetch failed"),
    "iets raars",
    undefined,
    null,
    { status: "x" },
  ]
  for (const e of bad) {
    assert.equal(loginErrorMessage(e), AUTH_MESSAGES.login_other)
    assert.equal(signupErrorMessage(e), AUTH_MESSAGES.signup_other)
  }
})

test("de klantmelding bevat nooit Engelse of technische tekst", () => {
  const raw = [
    "Invalid email or password",
    "Identity with email already exists",
    "Password is too short",
    "Cannot read properties of undefined",
    "FetchError: Unauthorized",
  ]
  for (const message of raw) {
    for (const fn of [loginErrorMessage, signupErrorMessage]) {
      const out = fn(fetchError(message, 401))
      assert.ok(!/error|invalid|identity|undefined|fetch|unauthorized|password|exists/i.test(out), out)
    }
  }
})

test("de serverlog bevat soort en status, maar nooit de foutdetails", () => {
  const line = authErrorLogLine("login", fetchError("Identity with email klant@voorbeeld.nl already exists", 401))
  assert.equal(line, "[login] mislukt: soort=email_exists status=401")
  assert.ok(!line.includes("klant@voorbeeld.nl"))
})
