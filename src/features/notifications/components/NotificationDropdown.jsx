import React from "react"
import { ArrowLeft } from "lucide-react"

const NotificationDropdown = ({ onClose }) => {
  return (
    <div className="flex flex-col h-[100dvh] md:h-auto bg-white md:rounded-xl p-4 md:shadow-lg md:ring-1 md:ring-black md:ring-opacity-5">
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={onClose}
          className="md:hidden flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </button>
        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center text-center text-gray-500 md:h-64 md:flex-none">
        <p>No new notifications</p>
      </div>
    </div>
  )
}

export default NotificationDropdown
