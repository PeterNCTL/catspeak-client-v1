import React from "react"
import { colors } from "@/shared/utils/colors"

const TextInput = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  autoFocus = false,
  type = "text",
  variant = "round",
  className = "",
  containerClassName = "",
  ...props
}) => {
  const variantClasses =
    variant === "square" ? "rounded-lg px-3" : "rounded-full px-4"

  const finalClassName = `h-10 w-full border border-[#C6C6C6] text-sm outline-none transition-colors focus:border-cath-red-700 focus:ring-1 focus:ring-cath-red-700 hover:border-cath-red-700 placeholder-[var(--placeholder-color)] ${variantClasses} ${className}`

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label htmlFor={id} className="text-sm">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        autoFocus={autoFocus}
        style={{
          "--border-color": colors.border,
          "--placeholder-color": colors.subtext,
        }}
        placeholder={placeholder}
        className={finalClassName}
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  )
}

export default TextInput
