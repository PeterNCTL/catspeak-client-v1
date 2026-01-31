import { useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence } from "framer-motion"
import LoginPopup from "@/components/Auth/popups/LoginPopup/index.jsx"
import RegisterPopup from "@/components/Auth/popups/RegisterPopup/index.jsx"
import HeroSection from "@/components/landing/HeroSection"
import LanguageBar from "@/components/landing/LanguageBar"
import ValuesSection from "@/components/landing/ValuesSection"
import AISection from "@/components/landing/AISection"
import FAQSection from "@/components/landing/FAQSection"

const LandingPage = () => {
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    mode: "login",
  })

  const openAuthModal = (mode = "login") =>
    setAuthModal({
      isOpen: true,
      mode,
    })

  const closeAuthModal = () =>
    setAuthModal((prev) => ({
      ...prev,
      isOpen: false,
    }))

  const switchAuthMode = (mode) => openAuthModal(mode)

  const renderAuthPopup = () => {
    if (!authModal.isOpen) return null

    const popup =
      authModal.mode === "register" ? (
        <RegisterPopup
          key="register"
          onClose={closeAuthModal}
          onSwitchMode={switchAuthMode}
        />
      ) : (
        <LoginPopup
          key="login"
          onClose={closeAuthModal}
          onSwitchMode={switchAuthMode}
        />
      )

    return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4 py-8">
        <div
          className="absolute inset-0"
          role="button"
          aria-label="Close authentication modal"
          onClick={closeAuthModal}
        />
        <div className="relative z-10 w-full max-w-xl">
          <AnimatePresence mode="wait">{popup}</AnimatePresence>
        </div>
      </div>,
      document.body,
    )
  }

  return (
    <div className="flex flex-col max-w-screen-xl">
      <div className="relative w-full pt-4">
        {/* Main Hero Section */}
        <HeroSection openAuthModal={openAuthModal} />

        {/* Languages row that overlaps hero bottom - Absolute positioned outside */}
        <LanguageBar />
      </div>

      {/* Values Section - Hero1 */}
      <ValuesSection />

      {/* AI Technology Section */}
      <AISection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Auth Modal */}
      {renderAuthPopup()}
    </div>
  )
}

export default LandingPage
