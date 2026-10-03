import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-large bg-bone p-5 small:px-8">
      <div>
        <p className="font-semibold text-ink">Heb je al een account?</p>
        <p className="mt-0.5 text-sm text-grey-70">
          Log in voor een snellere checkout.
        </p>
      </div>
      <LocalizedClientLink
        href="/account"
        className="inline-flex h-10 items-center rounded-circle bg-white px-5 text-sm font-semibold text-ink shadow-card hover:shadow-card-hover"
        data-testid="sign-in-button"
      >
        Inloggen
      </LocalizedClientLink>
    </div>
  )
}

export default SignInPrompt
