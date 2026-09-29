"use client"

import { useActionState } from "react"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"

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
            required
            autoComplete="given-name"
            data-testid="first-name-input"
          />
          <Input
            label="Achternaam"
            name="last_name"
            required
            autoComplete="family-name"
            data-testid="last-name-input"
          />
          <Input
            label="E-mail"
            name="email"
            required
            type="email"
            autoComplete="email"
            data-testid="email-input"
          />
          <Input
            label="Telefoon"
            name="phone"
            type="tel"
            autoComplete="tel"
            data-testid="phone-input"
          />
          <Input
            label="Wachtwoord"
            name="password"
            required
            type="password"
            autoComplete="new-password"
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="register-error" />
        <span className="text-center text-ui-fg-base text-small-regular mt-6">
          Door een account aan te maken, ga je akkoord met het{" "}
          <LocalizedClientLink
            href="/content/privacybeleid"
            className="underline"
          >
            Privacybeleid
          </LocalizedClientLink>{" "}
          en de{" "}
          <LocalizedClientLink
            href="/content/terms-of-use"
            className="underline"
          >
            Gebruiksvoorwaarden
          </LocalizedClientLink>{" "}
          van RC Choice.
        </span>
        <SubmitButton className="w-full mt-6" data-testid="register-button">
          Word klant
        </SubmitButton>
      </form>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        Al een account?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="underline"
        >
          Inloggen
        </button>
        .
      </span>
    </div>
  )
}

export default Register
