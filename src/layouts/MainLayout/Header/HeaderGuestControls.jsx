import React from "react"
import { useLanguage } from "../../../context/LanguageContext"
import PillButton from "@/components/ui/PillButton"

const HeaderGuestControls = ({ onGetStarted }) => {
  const { t } = useLanguage()

  const handleLogin = () => {
    if (onGetStarted) {
      onGetStarted("login") // Open modal
    }
  }

  return (
    <>
      <PillButton onClick={handleLogin}>{t.auth.loginButton}</PillButton>
    </>
  )
}

export default HeaderGuestControls
