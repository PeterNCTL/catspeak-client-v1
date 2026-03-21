import React, { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Settings, LogOut, Loader2, User, ArrowLeft } from "lucide-react"
import Avatar from "@/shared/components/ui/Avatar"
import { AnimatePresence } from "framer-motion"
import { useGetProfileQuery, useAuth, useLogoutMutation } from "@/features/auth"
import { useLanguage } from "@/shared/context/LanguageContext"
import FluentAnimation from "@/shared/animations/FluentAnimation"

const ProfileDropdown = () => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { user: authUser } = useAuth()
  const [logoutApi] = useLogoutMutation()
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
    logoutApi()
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
    "flex w-full items-center gap-3 px-4 h-10 text-base hover:bg-[#E5E5E5] transition-colors"

  const menuItemDisabledClass =
    "flex w-full items-center gap-3 px-4 h-10 text-base text-[#7A7574] cursor-not-allowed"

  return (
    <div className="relative" ref={menuRef}>
      {isLoading ? (
        <div className="flex h-10 w-10 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[#7A7574]" />
        </div>
      ) : (
        <button
          onClick={handleToggleMenu}
          className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-full transition-colors hover:bg-[#E5E5E5] focus:outline-none ${isOpen ? "bg-[#E5E5E5]" : ""}`}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <Avatar
            size={40}
            src={user?.avatarImageUrl}
            alt={user?.username || "User"}
            name={user?.fullName || user?.username}
          />
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <FluentAnimation
            animationKey="profile-dropdown"
            direction="down"
            distance={12}
            exit={true}
            className="fixed inset-0 z-[1200] md:absolute md:inset-auto md:right-0 md:mt-2 md:w-64 md:origin-top-right md:z-50"
          >
            <div className="flex h-[100dvh] flex-col bg-white overflow-hidden md:h-auto md:rounded-xl md:shadow-lg focus:outline-none">
              {/* Mobile Header */}
              <div className="flex md:hidden items-center gap-3 border-b border-[#F0F0F0] p-4 text-gray-800">
                <button
                  onClick={handleCloseMenu}
                  className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-700" />
                </button>
                <span className="text-lg font-semibold">
                  {t.header.profile || "Profile"}
                </span>
              </div>

              <div className="flex items-center gap-3 p-4">
                <Avatar
                  size={40}
                  src={user?.avatarImageUrl}
                  alt={user?.username || "User"}
                  name={user?.fullName || user?.username}
                />

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

              <div className="flex flex-col gap-1">
                <button disabled className={menuItemDisabledClass}>
                  <User />
                  <span className="text-sm">{t.header.profile}</span>
                </button>

                <button disabled className={menuItemDisabledClass}>
                  <Settings />
                  <span className="text-sm">{t.header.settings}</span>
                </button>

                <button onClick={handleLogout} className={menuItemClass}>
                  <LogOut />
                  <span className="text-sm">{t.header.logout}</span>
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
