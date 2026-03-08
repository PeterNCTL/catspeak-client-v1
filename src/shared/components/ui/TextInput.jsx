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
  className = "",
  containerClassName = "",
  ...props
}) => {
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
        className={`h-12 w-full rounded-full border border-[#C6C6C6] px-4 text-sm outline-none transition-colors focus:border-cath-red-700 focus:ring-1 focus:ring-cath-red-700 hover:border-cath-red-700 placeholder-[var(--placeholder-color)] ${className}`}
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  )
}

export default TextInput
