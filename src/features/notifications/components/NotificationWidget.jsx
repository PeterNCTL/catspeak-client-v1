import React, { useState, useRef, useEffect, useContext } from "react"
import { Bell } from "lucide-react"
import { AnimatePresence } from "framer-motion"
import FluentAnimation from "@/shared/animations/FluentAnimation"
import NotificationDropdown from "./NotificationDropdown"
import { useAuth } from "@/features/auth"
import AuthModalContext from "@/shared/context/AuthModalContext"

const NotificationWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const { isAuthenticated } = useAuth()
  const { openAuthModal } = useContext(AuthModalContext)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleDropdown = () => {
    if (!isAuthenticated) {
      openAuthModal("login")
      return
    }
    setIsOpen(!isOpen)
  }

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors hover:bg-[#E5E5E5] ${
          isOpen ? "" : ""
        }`}
        aria-label="Notifications"
      >
        <Bell />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="absolute right-0 top-full z-50 mt-2 w-80">
            <FluentAnimation direction="down" distance={10} exit={true}>
              <NotificationDropdown onClose={() => setIsOpen(false)} />
            </FluentAnimation>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NotificationWidget
