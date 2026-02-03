import React from "react"
import { FiMoreVertical } from "react-icons/fi"
import { getColorFromUsername, getInitials } from "../../../utils/avatarUtils"

const ConversationItem = ({ conversation, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-xl px-3 py-2 transition hover:bg-gray-50"
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full text-white text-xs font-semibold"
          style={{
            background: getColorFromUsername(conversation.friend.username),
          }}
        >
          {getInitials(conversation.friend.username)}
        </div>
        <div className="flex flex-col text-left">
          <span className="text-sm font-semibold text-gray-900">
            {conversation.friend.username}
          </span>
          <span className="text-xs text-gray-500 truncate max-w-[200px]">
            {conversation.lastMessage || "Chưa có tin nhắn"}
          </span>
        </div>
      </div>
      <FiMoreVertical className="text-gray-400" />
    </button>
  )
}

export default ConversationItem
