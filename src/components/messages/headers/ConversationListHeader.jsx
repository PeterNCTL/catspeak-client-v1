import React from "react"
import { FiSearch } from "react-icons/fi"

const ConversationListHeader = ({ onClose, isLoading }) => {
  return (
    <div className="flex items-center justify-between border-b px-4 py-3">
      <div className="flex h-9 flex-1 items-center rounded-full border border-gray-200 px-3 text-sm text-gray-600">
        <FiSearch className="mr-2 h-4 w-4 text-gray-400" />
        <input
          className="w-full bg-transparent outline-none placeholder:text-gray-400"
          placeholder="Tìm kiếm"
        />
      </div>
      {isLoading && (
        <span className="ml-2 text-xs text-gray-400">Đang tải...</span>
      )}
      <button
        onClick={onClose}
        className="ml-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#990011] text-white shadow hover:scale-105"
        aria-label="Đóng"
      >
        ✕
      </button>
    </div>
  )
}

export default ConversationListHeader
