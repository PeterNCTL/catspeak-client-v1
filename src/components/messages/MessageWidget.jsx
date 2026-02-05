import React from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  useGetConversationsQuery,
  useGetConversationMessagesQuery,
  useSendMessageMutation,
  conversationsApi,
} from "../../store/api/conversationsApi"
import useConversationSignalR from "../../hooks/useConversationSignalR"
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

  // -- SignalR Integration --
  const signalRHandlers = React.useMemo(
    () => ({
      NewMessage: (message) => {
        // If the message belongs to the active conversation, update the messages cache
        if (
          activeConversationId &&
          message.conversationId === activeConversationId
        ) {
          dispatch(
            conversationsApi.util.updateQueryData(
              "getConversationMessages",
              activeConversationId,
              (draft) => {
                // Prevent duplicates
                const exists = draft.find(
                  (m) => m.messageId === message.messageId,
                )
                if (!exists) {
                  draft.push(message)
                }
              },
            ),
          )
        }

        // Always invalidate conversations list to update snippets/unread counts
        dispatch(conversationsApi.util.invalidateTags(["Conversations"]))
      },
      NewConversation: (data) => {
        // Refresh conversation list
        dispatch(conversationsApi.util.invalidateTags(["Conversations"]))
      },
      FriendStatusChange: (data) => {
        // Refresh conversation list (to show online status)
        dispatch(conversationsApi.util.invalidateTags(["Conversations"]))
      },
      ChatUpdated: (data) => {
        dispatch(conversationsApi.util.invalidateTags(["Conversations"]))
      },
    }),
    [activeConversationId, dispatch],
  )

  const { sendMessage: sendSignalRMessage } =
    useConversationSignalR(signalRHandlers)

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
      // Option: Use SignalR for sending if preferred, or stick to REST.
      // Using REST confirms persistence before UI update (unless optimistic).
      // If using SignalR: await sendSignalRMessage(activeConversationId, input)

      await sendMessage({
        conversationId: activeConversationId,
        messageData: { content: input },
      }).unwrap()

      setInput("")
      // refetchMessages() // No longer needed if SignalR 'NewMessage' fires or mutation invalidates tags
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
