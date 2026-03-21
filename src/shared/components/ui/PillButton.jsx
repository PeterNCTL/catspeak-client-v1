import { Loader2 } from "lucide-react"

const PillButton = ({
  children,
  onClick,
  startIcon,
  endIcon,
  loading = false,
  disabled = false,
  loadingText,
  variant = "primary", // "primary" | "secondary"
  bgColor,
  textColor,
  className = "",
  ...props
}) => {
  const isSecondary = variant === "secondary"
  const isActuallyDisabled = disabled || loading

  const heightClass = className && className.match(/\bh-\S+/) ? "" : "h-12"
  const baseStyles = `${heightClass} px-4 rounded-full font-medium text-sm flex items-center justify-center gap-2 transition whitespace-nowrap`

  // Default variant styles
  const variantStyles = isSecondary
    ? "bg-white text-black hover:bg-[#E5E5E5] active:bg-[#e0e0e0]"
    : "bg-[#990011] text-white hover:brightness-90 active:brightness-75"

  const disabledStyles =
    "disabled:bg-[#BFBFBF] disabled:text-white disabled:brightness-100"

  // Inline styles for custom colors, but only when not disabled
  const customStyle =
    !isActuallyDisabled && (bgColor || textColor)
      ? { backgroundColor: bgColor, color: textColor }
      : {}

  return (
    <button
      onClick={onClick}
      disabled={isActuallyDisabled}
      style={customStyle}
      className={`${baseStyles} ${variantStyles} ${disabledStyles} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin w-4 h-4" />
          <span>{loadingText || children}</span>
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
