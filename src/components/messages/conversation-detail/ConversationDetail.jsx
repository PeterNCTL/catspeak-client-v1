import React from "react"
import MessageList from "./MessageList"
import MessageInput from "./MessageInput"

const ConversationDetail = ({
  conversation,
  messages,
  isLoading,
  input,
  onInputChange,
  onSendMessage,
  onKeyPress,
  isSending,
}) => {
  if (!conversation) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#990011]"></div>
      </div>
    )
  }

  return (
    <>
      <MessageList
        messages={messages || []}
        isLoading={isLoading}
        friendAccountId={conversation?.friend?.accountId}
      />
      <MessageInput
        value={input}
        onChange={onInputChange}
        onSend={onSendMessage}
        onKeyPress={onKeyPress}
        disabled={isSending}
      />
    </>
  )
}

export default ConversationDetail
