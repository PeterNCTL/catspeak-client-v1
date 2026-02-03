import React, { useEffect, useRef } from "react"
import MessageBubble from "./MessageBubble"

const MessageList = ({ messages, isLoading, friendAccountId }) => {
  const messagesEndRef = useRef(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return (
    <div className="h-[350px] overflow-y-auto px-4 py-3 space-y-2">
      {isLoading ? (
        <div className="text-center text-sm text-gray-400 py-4">
          Đang tải tin nhắn...
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center text-sm text-gray-400 py-4">
          Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện!
        </div>
      ) : (
        messages.map((msg, idx) => {
          const isMyMessage = msg.sender.accountId !== friendAccountId
          return (
            <MessageBubble key={idx} message={msg} isMyMessage={isMyMessage} />
          )
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default MessageList
