import React from "react"
import { FiArrowLeft } from "react-icons/fi"
import { getColorFromUsername, getInitials } from "../../../utils/avatarUtils"

const ConversationDetailHeader = ({ conversation, onBack, onClose }) => {
  return (
    <div className="flex items-center justify-between border-b px-4 py-3">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
      >
        <FiArrowLeft className="h-5 w-5" />
        <div className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-white text-xs font-semibold"
            style={{
              background: getColorFromUsername(conversation.friend.username),
            }}
          >
            {getInitials(conversation.friend.username)}
          </div>
          <span className="font-semibold">{conversation.friend.username}</span>
        </div>
      </button>
      <button
        onClick={onClose}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#990011] text-white shadow hover:scale-105"
        aria-label="Đóng"
      >
        ✕
      </button>
    </div>
  )
}

export default ConversationDetailHeader
