import { useEffect } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence } from "framer-motion"
import LoginPopup from "./popups/LoginPopup"
import RegisterPopup from "./popups/RegisterPopup"
import ResetPasswordPopup from "./popups/ResetPasswordPopup"

const Auth = ({ isOpen, mode = "login", onClose, onSwitchMode }) => {
  if (!isOpen) return null

  const renderPopup = () => {
    switch (mode) {
      case "register":
        return (
          <RegisterPopup
            key="register"
            open={isOpen}
            onClose={onClose}
            onSwitchMode={onSwitchMode}
          />
        )

      case "forgot":
        return (
          <ResetPasswordPopup
            key="forgot"
            onClose={onClose}
            onSwitchMode={onSwitchMode}
          />
        )
      case "reset-password":
        return (
          <ResetPasswordPopup
            key="reset-password"
            onClose={onClose}
            onSwitchMode={onSwitchMode}
          />
        )
      default:
        return (
          <LoginPopup
            key="login"
            open={isOpen}
            onClose={onClose}
            onSwitchMode={onSwitchMode}
          />
        )
    }
  }

  // LoginPopup and RegisterPopup use MUI Dialog which handles its own portal and backdrop
  if (mode === "login" || mode === "register") {
    return renderPopup()
  }

  // Other popups still use the portal wrapper
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4 py-8">
      <div
        className="absolute inset-0"
        role="button"
        aria-label="Close authentication modal"
        onClick={onClose}
      />
      <div
        className={`relative z-10 w-full ${
          mode === "register" ? "max-w-4xl" : "max-w-xl"
        }`}
      >
        <AnimatePresence mode="wait">{renderPopup()}</AnimatePresence>
      </div>
    </div>,
    document.body,
  )
}

export default Auth
