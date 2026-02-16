import React from "react"

/**
 * BubblePillMessage
 * A flexible, prominent red pill button.
 * Replaces the previous fixed-SVG version to support variable text lengths.
 */
const BubblePillMessage = ({ className = "", children, asChild, ...rest }) => {
  return (
    <button
      type="button"
      className={[
        "inline-flex h-12 items-center justify-center rounded-full px-6",
        "bg-cath-red-700 text-white text-sm font-medium transition-colors",
        "hover:bg-cath-red-800",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "whitespace-nowrap min-w-[120px]",
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </button>
  )
}

export default BubblePillMessage
