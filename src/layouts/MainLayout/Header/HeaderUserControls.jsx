import React, { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Bell, Settings, LogOut, Loader2, User } from "lucide-react"
import { useGetProfileQuery, useAuth } from "@/features/auth"
import { useLanguage } from "@/shared/context/LanguageContext"

const HeaderUserControls = () => {
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

  // Click outside to close menu
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

  return (
    <div className="flex items-center gap-4">
      {/* Notification Bell */}
      <button
        className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
        aria-label="Notifications"
      >
        <Bell size={24} />
      </button>

      {/* Avatar / Profile Trigger */}
      <div className="relative" ref={menuRef}>
        {isLoading ? (
          <div className="flex h-10 w-10 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <button
            onClick={handleToggleMenu}
            className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-gray-200 transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-gray-200"
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
              <div className="flex h-full w-full items-center justify-center bg-gray-100 text-sm font-medium text-gray-600">
                {getInitials(user?.fullName || user?.username)}
              </div>
            )}
          </button>
        )}

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl border border-gray-100 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
            {/* User Info */}
            <div className="px-4 py-3">
              <p className="truncate text-sm font-medium text-gray-900">
                {user?.username || "User"}
              </p>
              <p className="truncate text-xs text-gray-500">
                {user?.email || ""}
              </p>
            </div>

            <div className="border-t border-gray-100"></div>

            {/* Menu Items */}
            <div className="py-1">
              <button
                onClick={() => {
                  handleCloseMenu()
                  navigate("/profile")
                }}
                className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              >
                <User size={18} />
                <span>{t.header.profile || "Profile"}</span>
              </button>

              <button
                disabled
                className="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-gray-400 cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <Settings size={18} />
                  <span>{t.header.settings}</span>
                </div>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">
                  {t.header.soon}
                </span>
              </button>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              >
                <LogOut size={18} />
                <span>{t.header.logout}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HeaderUserControls
