import React from "react"
import { AnimatePresence } from "framer-motion"
import FluentAnimation from "@/shared/animations/FluentAnimation"

const MessageModal = ({ isOpen, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <FluentAnimation
          animationKey="message-modal"
          direction="down"
          distance={12}
          exit={true}
          className="absolute right-0 top-full mt-2 z-[1200] w-[340px] max-w-[90vw] overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl"
        >
          {children}
        </FluentAnimation>
      )}
    </AnimatePresence>
  )
}

export default MessageModal
