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
          className="fixed inset-0 z-[1200] flex h-[100dvh] w-screen flex-col overflow-hidden bg-white md:absolute md:inset-auto md:right-0 md:top-full md:mt-2 md:h-auto md:w-[340px] md:max-w-[90vw] md:rounded-xl md:border md:border-gray-200 md:shadow-2xl"
        >
          {children}
        </FluentAnimation>
      )}
    </AnimatePresence>
  )
}

export default MessageModal
