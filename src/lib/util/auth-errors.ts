// Nederlandse foutmeldingen voor inloggen en registreren.
// De Medusa-SDK gooit een FetchError met de tekst van de backend (Engels) en een HTTP-status.
// Die tekst en de status gaan nooit naar de klant; alleen de zinnen hieronder.

export type AuthErrorKind =
  | "invalid_credentials"
  | "email_exists"
  | "weak_password"
  | "invalid_email"
  | "rate_limited"
  | "other"

export const AUTH_MESSAGES = {
  invalid_credentials:
    "Het e-mailadres of wachtwoord klopt niet. Controleer je gegevens en probeer het opnieuw.",
  email_exists:
    "Er is al een account met dit e-mailadres. Log in, of gebruik een ander e-mailadres.",
  weak_password:
    "Dit wachtwoord is te zwak. Kies een langer wachtwoord dat moeilijker te raden is.",
  invalid_email:
    "Dit e-mailadres lijkt niet te kloppen. Controleer het en probeer het opnieuw.",
  rate_limited:
    "Er zijn te veel pogingen gedaan. Wacht even en probeer het daarna opnieuw.",
  login_other: "Inloggen is niet gelukt. Probeer het later opnieuw.",
  signup_other: "Registreren is niet gelukt. Probeer het later opnieuw.",
  cart_transfer:
    "Je bent ingelogd, maar je winkelwagen kon niet worden overgenomen. Ververs de pagina en probeer het opnieuw.",
} as const

function readError(error: unknown): { status?: number; message: string } {
  if (error && typeof error === "object") {
    const e = error as { status?: unknown; message?: unknown }
    return {
      status: typeof e.status === "number" ? e.status : undefined,
      message: typeof e.message === "string" ? e.message : "",
    }
  }
  return { message: typeof error === "string" ? error : "" }
}

export function classifyAuthError(error: unknown): AuthErrorKind {
  const { status, message } = readError(error)
  const m = message.toLowerCase()

  if (/already (exist|registered|in use|taken)|duplicate|bestaat al/.test(m)) {
    return "email_exists"
  }
  if (
    /invalid email or password|invalid credentials|incorrect|wrong password|unauthorized/.test(m) ||
    (status === 401 && !m)
  ) {
    return "invalid_credentials"
  }
  if (
    /password|wachtwoord/.test(m) &&
    /weak|short|too |least|minimum|\bmin\b|length|characters|strong|complex|upper|lower|digit|number|special|zwak|kort/.test(m)
  ) {
    return "weak_password"
  }
  if (/e-?mail/.test(m) && /invalid|valid|format|ongeldig/.test(m)) {
    return "invalid_email"
  }
  if (status === 429 || /too many|rate limit/.test(m)) {
    return "rate_limited"
  }
  if (status === 401) {
    return "invalid_credentials"
  }
  return "other"
}

export function loginErrorMessage(error: unknown): string {
  switch (classifyAuthError(error)) {
    case "invalid_credentials":
    case "email_exists":
      return AUTH_MESSAGES.invalid_credentials
    case "rate_limited":
      return AUTH_MESSAGES.rate_limited
    case "invalid_email":
      return AUTH_MESSAGES.invalid_email
    default:
      return AUTH_MESSAGES.login_other
  }
}

export function signupErrorMessage(error: unknown): string {
  switch (classifyAuthError(error)) {
    case "email_exists":
      return AUTH_MESSAGES.email_exists
    case "weak_password":
      return AUTH_MESSAGES.weak_password
    case "invalid_email":
      return AUTH_MESSAGES.invalid_email
    case "rate_limited":
      return AUTH_MESSAGES.rate_limited
    default:
      return AUTH_MESSAGES.signup_other
  }
}

/** Voor de serverlog: alleen soort en status, nooit de tekst of persoonsgegevens. */
export function authErrorLogLine(action: string, error: unknown): string {
  const { status } = readError(error)
  return `[${action}] mislukt: soort=${classifyAuthError(error)} status=${status ?? "onbekend"}`
}
