import { Loader2 } from "lucide-react"
import React from "react"

const LoadingSpinner = ({
  className = "flex flex-col items-center justify-center p-10",
}) => {
  return (
    <div className={className}>
      <Loader2 className="h-8 w-8 animate-spin text-[#990011]" />
      <span className="mt-3 text-sm">Loading...</span>
    </div>
  )
}

export default LoadingSpinner
