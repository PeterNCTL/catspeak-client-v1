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
  return (
    <>
      <MessageList
        messages={messages}
        isLoading={isLoading}
        friendAccountId={conversation.friend.accountId}
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
