"use client"

import { useActionState } from "react"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"

// Link blijft visueel gelijk; het aanraakgebied is minimaal 44 px hoog.
const HIT_AREA =
  "underline relative after:content-[''] after:absolute after:inset-x-0 after:top-1/2 after:h-11 after:-translate-y-1/2"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(signup, null)

  return (
    <div
      className="max-w-sm flex flex-col items-center"
      data-testid="register-page"
    >
      <h1 className="text-large-semi uppercase mb-6">
        Word RC Choice klant
      </h1>
      <p className="text-center text-base-regular text-ui-fg-base mb-4">
        Maak je RC Choice klantprofiel aan en krijg toegang tot een prettigere
        winkelervaring.
      </p>
      <form className="w-full flex flex-col" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Voornaam"
            name="first_name"
            id="register-first-name"
            required
            autoComplete="given-name"
            data-testid="first-name-input"
          />
          <Input
            label="Achternaam"
            name="last_name"
            id="register-last-name"
            required
            autoComplete="family-name"
            data-testid="last-name-input"
          />
          <Input
            label="E-mail"
            name="email"
            id="register-email"
            required
            type="email"
            autoComplete="email"
            data-testid="email-input"
          />
          <Input
            label="Telefoon"
            name="phone"
            id="register-phone"
            type="tel"
            autoComplete="tel"
            data-testid="phone-input"
          />
          <Input
            label="Wachtwoord"
            name="password"
            id="register-password"
            required
            type="password"
            autoComplete="new-password"
            data-testid="password-input"
          />
        </div>
        <ErrorMessage
          error={typeof message === "string" ? message : null}
          data-testid="register-error"
        />
        <span className="text-center text-ui-fg-base text-small-regular mt-6">
          Door een account aan te maken, ga je akkoord met het{" "}
          <LocalizedClientLink
            href="/content/privacybeleid"
            className={HIT_AREA}
          >
            Privacybeleid
          </LocalizedClientLink>{" "}
          en de{" "}
          <LocalizedClientLink
            href="/content/algemene-voorwaarden"
            className={HIT_AREA}
          >
            Algemene voorwaarden
          </LocalizedClientLink>{" "}
          van RC Choice.
        </span>
        <SubmitButton className="w-full mt-6 min-h-[44px]" data-testid="register-button">
          Word klant
        </SubmitButton>
      </form>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        Al een account?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="underline inline-flex items-center min-h-[44px] -my-3 px-1"
        >
          Inloggen
        </button>
        .
      </span>
    </div>
  )
}

export default Register
