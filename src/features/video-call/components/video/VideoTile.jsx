import { MicOff, VideoOff } from "lucide-react"
import useAudioLevel from "../../hooks/useAudioLevel"
import { useEffect, useRef, useMemo } from "react"
import { useParticipant } from "@videosdk.live/react-sdk"

const VideoTile = ({ participantId }) => {
  const { displayName, webcamStream, micStream, webcamOn, micOn, isLocal } =
    useParticipant(participantId)

  const videoTrack = webcamStream?.track ?? null
  const audioTrack = micStream?.track ?? null

  // Build a stable MediaStream only when the underlying tracks change.
  const sdkStream = useMemo(() => {
    const tracks = []
    if (videoTrack && webcamOn) tracks.push(videoTrack)
    if (audioTrack && micOn) tracks.push(audioTrack)
    return tracks.length > 0 ? new MediaStream(tracks) : null
  }, [videoTrack, audioTrack, micOn, webcamOn])

  const audioLevel = useAudioLevel(audioTrack)
  const isSpeaking = micOn && audioLevel > 5

  const videoRef = useRef(null)
  const hasVideoTrack = sdkStream && sdkStream.getVideoTracks().length > 0
  const isVideoVisible = webcamOn && hasVideoTrack

  useEffect(() => {
    if (!videoRef.current) return
    videoRef.current.srcObject = sdkStream ?? null
  }, [sdkStream])

  return (
    <div
      className={`relative h-full w-full min-h-[150px] overflow-hidden rounded-lg bg-white border border-solid transition-[border-color,box-shadow] duration-200 ease-in-out ${
        isSpeaking
          ? "border-green-600 shadow-[0_0_15px_rgba(46,125,50,0.4)]"
          : "border-[#C6C6C6] shadow-sm"
      }`}
    >
      {/* Always render if stream exists — keeps audio playing even when video is off */}
      {sdkStream && (
        <video
          autoPlay
          playsInline
          muted={isLocal}
          ref={videoRef}
          className={`h-full w-full object-cover ${isVideoVisible ? "block" : "hidden"}`}
          onError={() => {}}
        />
      )}

      {/* Avatar fallback when no video */}
      {(!sdkStream || !isVideoVisible) && (
        <div className="flex h-full w-full items-center justify-center">
          <div
            className={`flex h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-gray-200 text-2xl font-bold text-gray-600 border-4 border-solid ${
              isSpeaking
                ? "border-green-600 shadow-[0_0_15px_rgba(46,125,50,0.4)]"
                : "border-[#C6C6C6]"
            }`}
          >
            {(displayName || "?").charAt(0).toUpperCase()}
          </div>
        </div>
      )}

      {/* Name + speaking indicator */}
      <div className="absolute bottom-3 left-3 flex max-w-[70%] items-center gap-2">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap text-xs font-medium text-gray-900 sm:text-[0.8rem] md:text-sm">
          {displayName} {isLocal && "(You)"}
        </div>
        {isSpeaking && (
          <div className="flex h-3 items-end gap-[2px]">
            <div className="h-2 w-[3px] animate-[pulse_1s_ease-in-out_infinite] rounded-full bg-green-600" />
            <div className="h-3 w-[3px] animate-[pulse_1s_ease-in-out_infinite] rounded-full bg-green-600 delay-100" />
            <div className="h-[6px] w-[3px] animate-[pulse_1s_ease-in-out_infinite] rounded-full bg-green-600 delay-200" />
          </div>
        )}
      </div>

      {/* Mic / cam off icons */}
      <div className="absolute bottom-3 right-3 flex items-center gap-2">
        {!micOn && <MicOff className="h-[18px] w-[18px] text-red-500" />}
        {!webcamOn && <VideoOff className="h-[18px] w-[18px] text-red-500" />}
      </div>
    </div>
  )
}

export default VideoTile
