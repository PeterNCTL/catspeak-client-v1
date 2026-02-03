import React from "react"

const MessageModal = ({ isOpen, children }) => {
  if (!isOpen) return null

  return (
    <div className="w-[340px] max-w-[90vw] overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">
      {children}
    </div>
  )
}

export default MessageModal
