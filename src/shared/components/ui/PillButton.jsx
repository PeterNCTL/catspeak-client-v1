import React from "react"
import { Loader2 } from "lucide-react"

const PillButton = ({
  children,
  onClick,
  startIcon,
  endIcon,
  loading = false,
  disabled = false,
  bgColor = "#990011",
  textColor = "white",
  className = "",
  variant = "primary", // "primary" | "secondary"
  ...props
}) => {
  const isSecondary = variant === "secondary"

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={!isSecondary ? { backgroundColor: bgColor, color: textColor } : {}}
      className={`
        h-12
        px-4
        rounded-full
        font-medium
        text-sm
        flex items-center justify-center gap-2
        transition
        ${
          isSecondary
            ? "bg-white text-black hover:bg-[#E5E5E5] active:bg-[#e0e0e0]"
            : "hover:brightness-90 active:brightness-75"
        }
        disabled:brightness-100
        disabled:bg-[#BFBFBF]
        disabled:text-white
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin w-4 h-4" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {startIcon}
          {children}
          {endIcon}
        </>
      )}
    </button>
  )
}

export default PillButton
