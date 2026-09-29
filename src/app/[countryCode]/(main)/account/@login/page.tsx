import { Metadata } from "next"

import LoginTemplate from "@modules/account/templates/login-template"

export const metadata: Metadata = {
  title: "Inloggen",
  description: "Log in bij je RC Choice account.",
}

export default function Login() {
  return <LoginTemplate />
}
