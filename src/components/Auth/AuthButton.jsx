import React from "react"

const AuthButton = ({
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`relative w-full rounded-full py-3 text-lg font-black uppercase tracking-widest text-white bg-[linear-gradient(135deg,#910B09,#F5A51B)] hover:shadow-lg overflow-hidden transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default AuthButton
