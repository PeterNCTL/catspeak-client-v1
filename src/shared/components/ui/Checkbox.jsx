import React from "react"

const Checkbox = ({ checked, onChange, id, className = "" }) => {
  return (
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={onChange}
      className={`cursor-pointer accent-[#B91264] ${className}`}
    />
  )
}

export default Checkbox
