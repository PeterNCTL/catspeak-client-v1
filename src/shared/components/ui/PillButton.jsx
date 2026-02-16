import React from "react"
import { Loader2 } from "lucide-react"

const PillButton = ({
  children,
  onClick,
  variant = "contained",
  color = "primary", // can be 'primary' (red) or 'inherit' (gray/text)
  startIcon,
  endIcon,
  disabled = false,
  loading = false,
  loadingText,
  fullWidth = false,
  className = "",
  ...props
}) => {
  const isRed = variant === "contained" && color === "primary"
  const isText = variant === "text"

  const baseClasses = `
    inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 
    text-sm font-medium uppercase transition-colors 
    disabled:cursor-not-allowed disabled:opacity-50
    ${fullWidth ? "w-full" : ""}
  `

  const variantClasses = isRed
    ? "bg-cath-red-700 text-white hover:bg-cath-red-800"
    : isText
      ? "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      : "bg-gray-200 text-gray-800 hover:bg-gray-300"

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          {loadingText && <span>{loadingText}</span>}
        </div>
      ) : (
        <>
          {startIcon && <span className="mr-1">{startIcon}</span>}
          {children}
          {endIcon && <span className="ml-1">{endIcon}</span>}
        </>
      )}
    </button>
  )
}

export default PillButton
