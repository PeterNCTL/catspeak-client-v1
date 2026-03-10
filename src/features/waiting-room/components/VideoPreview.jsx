import React from "react"
import { Mic, MicOff, Video, VideoOff } from "lucide-react"
import { useLanguage } from "@/shared/context/LanguageContext"

const VideoPreview = ({
  localStream,
  micOn,
  cameraOn,
  user,
  onToggleMic,
  onToggleCam,
}) => {
  const { t } = useLanguage()
  return (
    <div className="relative mb-6 h-[300px] w-full max-w-full overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-xl sm:h-[350px] sm:w-[90%] md:h-[400px] md:w-[700px]">
      {/* Video Preview */}
      {localStream && (
        <video
          ref={(video) => {
            if (video) {
              video.srcObject = localStream
              if (micOn) video.muted = true // Mute local preview to prevent echo
            }
          }}
          autoPlay
          playsInline
          muted // Always mute local video preview purely for UI
          className={`h-full w-full object-cover -scale-x-100 ${!cameraOn ? "hidden" : ""}`}
        />
      )}

      {!cameraOn && (
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-100 bg-white text-2xl font-bold text-[#990011] shadow-lg md:h-24 md:w-24 md:text-3xl">
            {user?.username?.[0]?.toUpperCase() || "U"}
          </div>
        </div>
      )}

      {/* Controls Overlay */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-row gap-6">
        <button
          onClick={onToggleMic}
          className={`flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-200 ${
            micOn
              ? "bg-[#990011] text-white hover:bg-[#7a000e]"
              : "border border-gray-200 bg-white text-[#990011/80] hover:bg-[#E5E5E5]"
          }`}
        >
          {micOn ? <Mic /> : <MicOff />}
        </button>

        <button
          onClick={onToggleCam}
          className={`flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-200 ${
            cameraOn
              ? "bg-[#990011] text-white hover:bg-[#7a000e]"
              : "border border-gray-200 bg-white text-[#990011/80] hover:bg-[#E5E5E5]"
          }`}
        >
          {cameraOn ? <Video /> : <VideoOff />}
        </button>
      </div>
    </div>
  )
}

export default VideoPreview
