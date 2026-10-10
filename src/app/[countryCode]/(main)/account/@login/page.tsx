import { Metadata } from "next"

import { titleWithBrand } from "@lib/util/brand"
import LoginTemplate from "@modules/account/templates/login-template"

export const metadata: Metadata = {
  title: titleWithBrand("Inloggen"),
  description: "Log in bij je RC Choice account.",
}

export default function Login() {
  return <LoginTemplate />
}
