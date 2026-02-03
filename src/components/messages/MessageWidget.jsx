import React, { useState } from "react"
import {
  useGetConversationsQuery,
  useGetConversationMessagesQuery,
  useSendMessageMutation,
} from "../../store/api/conversationsApi"
import FloatingButton from "./FloatingButton"
import MessageModal from "./MessageModal"
import ConversationListHeader from "./headers/ConversationListHeader"
import ConversationDetailHeader from "./headers/ConversationDetailHeader"
import ConversationList from "./conversation-list/ConversationList"
import ConversationDetail from "./conversation-detail/ConversationDetail"

const MessageWidget = () => {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [input, setInput] = useState("")
  const [view, setView] = useState("list") // "list" or "detail"

  // Fetch conversations from API
  const {
    data: conversations = [],
    isLoading,
    isError,
  } = useGetConversationsQuery()

  // Fetch messages for selected conversation
  const {
    data: messages = [],
    isLoading: messagesLoading,
    refetch: refetchMessages,
  } = useGetConversationMessagesQuery(selected?.conversationId, {
    skip: !selected?.conversationId,
  })

  // Send message mutation
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation()

  // Handle conversation selection
  const handleSelectConversation = (conv) => {
    setSelected(conv)
    setView("detail")
  }

  // Handle back to list
  const handleBackToList = () => {
    setView("list")
    setSelected(null)
  }

  // Handle send message
  const handleSendMessage = async () => {
    if (!input.trim() || !selected?.conversationId) return

    try {
      await sendMessage({
        conversationId: selected.conversationId,
        messageData: { content: input },
      }).unwrap()
      setInput("")
      refetchMessages()
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-[1200] flex flex-col items-end gap-3">
      <MessageModal isOpen={open}>
        {/* Header */}
        {view === "detail" && selected ? (
          <ConversationDetailHeader
            conversation={selected}
            onBack={handleBackToList}
            onClose={() => setOpen(false)}
          />
        ) : (
          <ConversationListHeader
            onClose={() => setOpen(false)}
            isLoading={isLoading}
          />
        )}

        {/* Content Area */}
        {view === "list" ? (
          <ConversationList
            conversations={conversations}
            isLoading={isLoading}
            isError={isError}
            onSelectConversation={handleSelectConversation}
          />
        ) : (
          <ConversationDetail
            conversation={selected}
            messages={messages}
            isLoading={messagesLoading}
            input={input}
            onInputChange={(e) => setInput(e.target.value)}
            onSendMessage={handleSendMessage}
            onKeyPress={handleKeyPress}
            isSending={isSending}
          />
        )}
      </MessageModal>

      <FloatingButton onClick={() => setOpen((v) => !v)} />
    </div>
  )
}

export default MessageWidget
