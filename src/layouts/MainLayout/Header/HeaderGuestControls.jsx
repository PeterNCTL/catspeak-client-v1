import React from "react"
import { useLanguage } from "../../../shared/context/LanguageContext"
import PillButton from "@/shared/components/ui/PillButton"

const HeaderGuestControls = ({ onGetStarted }) => {
  const { t } = useLanguage()

  const handleLogin = () => {
    if (onGetStarted) {
      onGetStarted("login") // Open modal
    }
  }

  return (
    <>
      <PillButton onClick={handleLogin} style={{ whiteSpace: "nowrap" }}>
        {t.auth.loginButton}
      </PillButton>
    </>
  )
}

export default HeaderGuestControls
