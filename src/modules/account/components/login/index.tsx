import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)

  return (
    <div
      className="max-w-sm w-full flex flex-col items-center"
      data-testid="login-page"
    >
      <h1 className="text-large-semi uppercase mb-6">Welkom terug</h1>
      <p className="text-center text-base-regular text-ui-fg-base mb-8">
        Log in voor een prettigere winkelervaring.
      </p>
      <form className="w-full" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="E-mail"
            name="email"
            id="login-email"
            type="email"
            title="Vul een geldig e-mailadres in."
            autoComplete="email"
            required
            data-testid="email-input"
          />
          <Input
            label="Wachtwoord"
            name="password"
            id="login-password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="login-error-message" />
        <SubmitButton data-testid="sign-in-button" className="w-full mt-6 min-h-[44px]">
          Inloggen
        </SubmitButton>
      </form>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        Nog geen account?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="underline inline-flex items-center min-h-[44px] -my-3 px-1"
          data-testid="register-button"
        >
          Word klant
        </button>
        .
      </span>
    </div>
  )
}

export default Login
