import React from "react"
import ConversationItem from "./ConversationItem"
import { useLanguage } from "@/context/LanguageContext"

const ConversationList = ({
  conversations,
  isLoading,
  isError,
  onSelectConversation,
}) => {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col px-4 pt-3 pb-4">
      <div className="text-xs font-semibold text-gray-900">
        {t.messages.title}
      </div>
      <div className="mt-3 space-y-2 max-h-[400px] overflow-y-auto">
        {isLoading ? (
          <div className="text-center text-sm text-gray-400 py-4">
            {t.messages.loading}
          </div>
        ) : isError ? (
          <div className="text-center text-sm text-red-500 py-4">
            {t.messages.error}
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center text-sm text-gray-400 py-4">
            {t.messages.noMessages}
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
