import React, { useState, useCallback } from "react"
import { useSelector } from "react-redux"
import { selectIsServerDown } from "@/store/slices/serverStatusSlice"
import { useLanguage } from "@/shared/context/LanguageContext"
import PillButton from "@/shared/components/ui/buttons/PillButton"
import { ServerCrash } from "lucide-react"

/**
 * Full-page overlay that blocks the app when the API server is unreachable.
 * The user can manually retry by clicking the button.
 */
const ServerDownScreen = () => {
  const isServerDown = useSelector(selectIsServerDown)
  const { t } = useLanguage()

  const [isRetrying, setIsRetrying] = useState(false)

  const healthCheck = useCallback(() => {
    setIsRetrying(true)
    window.location.reload()
  }, [])

  if (!isServerDown) return null

  const strings = t?.errors?.serverDown ?? {}

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4 max-w-[400px] px-8 py-12 text-center">
        {/* Icon */}
        <div className="text-red-600 mb-2">
          <ServerCrash size={64} strokeWidth={1.5} />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 leading-tight">
          {strings.title || "Server Unavailable"}
        </h1>

        {/* Message */}
        <p className="text-[15px] text-gray-600 leading-relaxed mb-2">
          {strings.message ||
            "The server is temporarily down. Our technical team is working on a fix. Please wait while we restore the service."}
        </p>

        {/* Retry button */}
        <PillButton
          className="h-10 min-w-[140px] mt-2"
          onClick={healthCheck}
          loading={isRetrying}
        >
          {strings.retry || "Retry Now"}
        </PillButton>
      </div>
    </div>
  )
}

export default ServerDownScreen
