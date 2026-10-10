"use client"

import { useEffect, useRef, useState } from "react"

import { titleWithBrand } from "@lib/util/brand"

import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState("sign-in")
  const firstRender = useRef(true)

  // Registreren en inloggen delen één URL; de paginatitel volgt de weergave (met merknaam).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    document.title = titleWithBrand(
      currentView === LOGIN_VIEW.REGISTER ? "Registreren" : "Inloggen"
    )
  }, [currentView])

  return (
    <div className="w-full flex justify-start px-8 py-8">
      {currentView === "sign-in" ? (
        <Login setCurrentView={setCurrentView} />
      ) : (
        <Register setCurrentView={setCurrentView} />
      )}
    </div>
  )
}

export default LoginTemplate
