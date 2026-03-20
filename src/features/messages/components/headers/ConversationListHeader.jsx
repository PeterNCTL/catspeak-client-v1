import React from "react"
import { FiSearch, FiArrowLeft } from "react-icons/fi"
import { useLanguage } from "@/shared/context/LanguageContext"

const ConversationListHeader = ({ onClose, isLoading }) => {
  const { t } = useLanguage()

  return (
    <div className="flex items-center gap-2 border-b px-4 py-3 md:justify-between">
      <button
        onClick={onClose}
        className="flex md:hidden h-9 w-9 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100"
        aria-label={t.messages.close}
      >
        <FiArrowLeft className="h-5 w-5" />
      </button>

      <div className="flex h-9 flex-1 items-center rounded-full border border-gray-200 px-3 text-sm text-gray-600">
        <FiSearch className="mr-2 h-4 w-4 text-gray-400" />
        <input
          className="w-full bg-transparent outline-none placeholder:text-gray-400"
          placeholder={t.messages.search}
        />
      </div>
      {isLoading && (
        <span className="ml-2 text-xs text-gray-400">{t.messages.loading}</span>
      )}
      <button
        onClick={onClose}
        className="hidden md:flex ml-3 h-9 w-9 items-center justify-center rounded-full bg-[#990011] text-white shadow hover:scale-105"
        aria-label={t.messages.close}
      >
        ✕
      </button>
    </div>
  )
}

export default ConversationListHeader
