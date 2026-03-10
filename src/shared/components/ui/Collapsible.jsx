import React, { useState } from "react"
import { FiChevronDown, FiChevronUp } from "react-icons/fi"
import { motion, AnimatePresence } from "framer-motion"

const Collapsible = ({
  title,
  defaultOpen = true,
  children,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const toggleOpen = () => setIsOpen((prev) => !prev)

  return (
    <div className={`flex flex-col ${className}`}>
      <button
        type="button"
        onClick={toggleOpen}
        className="flex items-center justify-between w-full text-left bg-transparent border-none cursor-pointer h-12 rounded-md px-4 transition-colors hover:bg-[#F2F2F2]"
        aria-expanded={isOpen}
      >
        <span className="font-bold text-base">{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FiChevronDown className="text-xl text-[#7A7574]" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Collapsible
