import React from "react"

const LoadingSpinner = ({ className = "p-10" }) => {
  return (
    <div className={`flex justify-center ${className}`}>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-black motion-reduce:animate-[spin_1.5s_linear_infinite]" />
    </div>
  )
}

export default LoadingSpinner
