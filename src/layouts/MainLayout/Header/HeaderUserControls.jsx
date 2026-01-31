import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FiBell, FiUser, FiSettings, FiLogOut, FiMail } from "react-icons/fi"
import { Spin, Dropdown } from "antd"
import { useGetProfileQuery } from "@/store/api/authApi"

import useAuth from "@/hooks/useAuth"

const HeaderUserControls = () => {
  const navigate = useNavigate()
  // Use useAuth for logout actions and user data access if available (though profile query is still used for details)
  const { logout, user: authUser } = useAuth()
  const { data: userData, isLoading } = useGetProfileQuery()
  const [isOpen, setIsOpen] = useState(false)
  const [imageError, setImageError] = useState(false)

  const user = userData?.data ?? authUser ?? {}

  const handleLogout = () => {
    console.log("=== LOGOUT CLICKED ===")
    logout()
    setIsOpen(false)
    navigate("/")
  }

  // Reset image error state when avatar URL changes
  useEffect(() => {
    setImageError(false)
  }, [user?.avatarImageUrl])

  const dropdownContent = (
    <div className="w-64 rounded-xl bg-white py-2 shadow-2xl ring-1 ring-black/5">
      {/* User Info Header */}
      <div className="px-4 py-3 border-b border-gray-100 mb-1">
        {isLoading ? (
          <div className="flex justify-center py-2">
            <Spin size="small" />
          </div>
        ) : (
          <div className="flex flex-col">
            <p className="text-sm font-bold text-gray-900 truncate mb-1">
              {user?.username}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <FiMail className="shrink-0 text-[#f08d1d]" />
              <span className="truncate">{user?.email}</span>
            </div>
          </div>
        )}
      </div>

      {/* Menu Items */}
      <button
        onClick={() => {
          setIsOpen(false)
          navigate("/app/setting")
        }}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-[#fff7ed] hover:text-[#ea580c] transition-colors"
      >
        <FiSettings className="w-4 h-4" />
        Settings
      </button>

      <div className="my-1 border-t border-gray-100" />

      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
      >
        <FiLogOut className="w-4 h-4" />
        Log out
      </button>
    </div>
  )

  return (
    <div className="flex items-center gap-4">
      {/* Notification Bell */}
      <button className="relative hidden lg:flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-b from-[#FAC126] to-[#990011] shadow-lg hover:shadow-xl transition-shadow">
        <FiBell className="h-5 w-5 text-white" />
      </button>

      {/* Avatar / Profile Trigger */}
      <div className="relative">
        <Dropdown
          popupRender={() => dropdownContent}
          trigger={["click"]}
          open={isOpen}
          onOpenChange={setIsOpen}
          placement="bottomRight"
        >
          <button className="flex items-center justify-center rounded-full hover:shadow-xl transition cursor-pointer">
            {isLoading ? (
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
            ) : (
              <div
                className={`flex items-center justify-center h-10 w-10 rounded-full overflow-hidden shadow-lg ${
                  user?.avatarImageUrl && !imageError
                    ? "bg-gray-100"
                    : "bg-gradient-to-b from-[#FAC126] to-[#990011]"
                }`}
              >
                {user?.avatarImageUrl && !imageError ? (
                  <img
                    src={user?.avatarImageUrl}
                    alt={user?.username}
                    className="h-full w-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <span className="text-white font-bold text-lg">
                    {user?.fullName?.charAt(0).toUpperCase() ||
                      user?.username?.charAt(0).toUpperCase() ||
                      "U"}
                  </span>
                )}
              </div>
            )}
          </button>
        </Dropdown>
      </div>
    </div>
  )
}

export default HeaderUserControls
