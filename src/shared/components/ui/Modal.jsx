import React, { useEffect } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"

const Modal = ({
  open,
  onClose,
  children,
  className = "",
  title,
  showCloseButton = true,
}) => {
  // Modal visibility is handled by the "open" prop and AnimatePresence

  // Use createPortal to render the modal at the document body level
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`relative h-full w-full shadow-xl sm:h-auto sm:max-w-md ${
              /(^|\s)bg-/.test(className) ? "" : "bg-white"
            } ${/(^|\s)p[xytrbl]?-(0|[1-9]|\[)/.test(className) ? "" : "p-5"} ${
              /(^|\s)rounded/.test(className)
                ? ""
                : "rounded-none sm:rounded-2xl"
            } ${className}`}
            role="dialog"
            aria-modal="true"
          >
            {(title || showCloseButton) && (
              <div
                className={`mb-6 flex items-center gap-4 ${title ? "justify-between" : "justify-end"}`}
              >
                {title && <h2 className="text-2xl font-semibold">{title}</h2>}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                )}
              </div>
            )}

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

export default Modal
