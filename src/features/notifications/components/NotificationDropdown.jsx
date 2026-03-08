import React from "react"

const NotificationDropdown = ({ onClose }) => {
  return (
    <div className="flex flex-col rounded-xl bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
      </div>
      <div className="flex h-64 flex-col items-center justify-center text-center text-gray-500">
        <p>No new notifications</p>
      </div>
    </div>
  )
}

export default NotificationDropdown
