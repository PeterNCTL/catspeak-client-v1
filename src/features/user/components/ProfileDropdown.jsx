import React, { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Settings, LogOut, Loader2, User } from "lucide-react"
import { AnimatePresence } from "framer-motion"
import { useGetProfileQuery, useAuth } from "@/features/auth"
import { useLanguage } from "@/shared/context/LanguageContext"
import FluentAnimation from "@/shared/animations/FluentAnimation"

const ProfileDropdown = () => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { logout, user: authUser } = useAuth()
  const { data: userData, isLoading } = useGetProfileQuery()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  const user = userData?.data ?? authUser ?? {}

  const handleToggleMenu = () => {
    setIsOpen((prev) => !prev)
  }

  const handleCloseMenu = () => {
    setIsOpen(false)
  }

  const handleLogout = () => {
    logout()
    handleCloseMenu()
    navigate("/")
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        handleCloseMenu()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U"
  }

  const menuItemClass =
    "flex w-full items-center gap-3 px-4 h-12 text-base hover:bg-[#E5E5E5] transition-colors"

  const menuItemDisabledClass =
    "flex w-full items-center gap-3 px-4 h-12 text-base text-[#7A7574] cursor-not-allowed"

  return (
    <div className="relative" ref={menuRef}>
      {isLoading ? (
        <div className="flex h-12 w-12 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#7A7574]" />
        </div>
      ) : (
        <button
          onClick={handleToggleMenu}
          className={`flex h-12 w-12 items-center justify-center overflow-hidden rounded-full transition-colors hover:bg-[#E5E5E5] focus:outline-none ${isOpen ? "bg-[#E5E5E5]" : ""}`}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {user?.avatarImageUrl ? (
            <img
              src={user.avatarImageUrl}
              alt={user.username || "User"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-[18px] font-medium text-gray-600">
              {getInitials(user?.fullName || user?.username)}
            </div>
          )}
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <FluentAnimation
            animationKey="profile-dropdown"
            direction="down"
            distance={12}
            exit={true}
            className="absolute right-0 mt-2 w-64 origin-top-right z-50"
          >
            <div className="rounded-xl bg-white shadow-lg focus:outline-none overflow-hidden">
              <div className="flex items-center gap-3 p-4">
                {user?.avatarImageUrl ? (
                  <img
                    src={user.avatarImageUrl}
                    alt={user.username || "User"}
                    className="h-10 w-10 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600 border border-gray-200">
                    {getInitials(user?.fullName || user?.username)}
                  </div>
                )}

                <div className="min-w-0">
                  <p className="m-0 truncate text-base font-medium">
                    {user?.username || "User"}
                  </p>
                  <p className="m-0 truncate text-sm text-[#7A7574]">
                    {user?.email || ""}
                  </p>
                </div>
              </div>

              <div className="border-t border-[#F0F0F0]" />

              <div className="flex flex-col">
                <button
                  onClick={() => {
                    handleCloseMenu()
                    navigate("/profile")
                  }}
                  className={menuItemClass}
                >
                  <User />
                  <span>{t.header.profile || "Profile"}</span>
                </button>

                <button disabled className={menuItemDisabledClass}>
                  <Settings />
                  <span className="flex-1 text-left">{t.header.settings}</span>
                </button>

                <button onClick={handleLogout} className={menuItemClass}>
                  <LogOut />
                  <span>{t.header.logout}</span>
                </button>
              </div>
            </div>
          </FluentAnimation>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProfileDropdown
