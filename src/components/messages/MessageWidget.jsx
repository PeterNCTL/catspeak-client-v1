import React from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  useGetConversationsQuery,
  useGetConversationMessagesQuery,
  useSendMessageMutation,
} from "../../store/api/conversationsApi"
import {
  closeWidget,
  openWidget,
  setActiveConversation,
  setView,
  toggleWidget,
} from "../../store/slices/messageWidgetSlice"
import FloatingButton from "./FloatingButton"
import MessageModal from "./MessageModal"
import ConversationListHeader from "./headers/ConversationListHeader"
import ConversationDetailHeader from "./headers/ConversationDetailHeader"
import ConversationList from "./conversation-list/ConversationList"
import ConversationDetail from "./conversation-detail/ConversationDetail"

const MessageWidget = () => {
  const dispatch = useDispatch()
  const { isOpen, activeConversationId, view } = useSelector(
    (state) => state.messageWidget,
  )
  const [input, setInput] = React.useState("")

  // Fetch conversations from API
  const {
    data: conversations = [],
    isLoading,
    isError,
  } = useGetConversationsQuery()

  // Find active conversation object
  const selected = conversations.find(
    (c) => c.conversationId === activeConversationId,
  )

  // Fetch messages for selected conversation
  const {
    data: messages = [],
    isLoading: messagesLoading,
    refetch: refetchMessages,
  } = useGetConversationMessagesQuery(activeConversationId, {
    skip: !activeConversationId,
  })

  // Send message mutation
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation()

  // Handle conversation selection
  const handleSelectConversation = (conv) => {
    dispatch(setActiveConversation(conv.conversationId))
  }

  // Handle back to list
  const handleBackToList = () => {
    dispatch(setView("list"))
    dispatch(setActiveConversation(null)) // Optional: clear selection
  }

  // Handle send message
  const handleSendMessage = async () => {
    if (!input.trim() || !activeConversationId) return

    try {
      await sendMessage({
        conversationId: activeConversationId,
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
      <MessageModal isOpen={isOpen}>
        {/* Header */}
        {view === "detail" && selected ? (
          <ConversationDetailHeader
            conversation={selected}
            onBack={handleBackToList}
            onClose={() => dispatch(closeWidget())}
          />
        ) : (
          <ConversationListHeader
            onClose={() => dispatch(closeWidget())}
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

      <FloatingButton onClick={() => dispatch(toggleWidget())} />
    </div>
  )
}

export default MessageWidget
