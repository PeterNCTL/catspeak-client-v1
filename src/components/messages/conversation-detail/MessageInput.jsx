import React from "react"
import { FiSend, FiPlus, FiPaperclip, FiImage } from "react-icons/fi"

const MessageInput = ({ value, onChange, onSend, onKeyPress, disabled }) => {
  return (
    <div className="flex items-center gap-2 border-t px-4 py-3">
      <button className="text-[#990011] hover:opacity-80" aria-label="Thêm">
        <FiPlus className="h-5 w-5" />
      </button>
      <button className="text-[#990011] hover:opacity-80" aria-label="Đính kèm">
        <FiPaperclip className="h-5 w-5" />
      </button>
      <button className="text-[#990011] hover:opacity-80" aria-label="Ảnh">
        <FiImage className="h-5 w-5" />
      </button>
      <input
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        placeholder="Aa"
        className="h-9 flex-1 rounded-full border border-gray-200 px-3 text-sm outline-none focus:border-[#990011]"
        disabled={disabled}
      />
      <button
        onClick={onSend}
        disabled={disabled || !value.trim()}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#990011] text-white shadow hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Gửi"
      >
        <FiSend className="h-5 w-5" />
      </button>
    </div>
  )
}

export default MessageInput
