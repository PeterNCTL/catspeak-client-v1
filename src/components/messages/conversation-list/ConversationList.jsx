import React from "react"
import ConversationItem from "./ConversationItem"

const ConversationList = ({
  conversations,
  isLoading,
  isError,
  onSelectConversation,
}) => {
  return (
    <div className="flex flex-col px-4 pt-3 pb-4">
      <div className="text-xs font-semibold text-gray-900">TIN NHẮN</div>
      <div className="mt-3 space-y-2 max-h-[400px] overflow-y-auto">
        {isLoading ? (
          <div className="text-center text-sm text-gray-400 py-4">
            Đang tải...
          </div>
        ) : isError ? (
          <div className="text-center text-sm text-red-500 py-4">
            Lỗi tải dữ liệu
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center text-sm text-gray-400 py-4">
            Chưa có tin nhắn
          </div>
        ) : (
          conversations.map((conv) => (
            <ConversationItem
              key={conv.conversationId}
              conversation={conv}
              onClick={() => onSelectConversation(conv)}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default ConversationList
