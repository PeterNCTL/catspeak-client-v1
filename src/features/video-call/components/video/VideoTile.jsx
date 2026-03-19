import { MicOff, VideoOff } from "lucide-react"
import useAudioLevel from "../../hooks/useAudioLevel"
import { useEffect, useRef, useMemo } from "react"
import { useParticipant } from "@videosdk.live/react-sdk"

const VideoTile = ({ participantId, avatar: propAvatar }) => {
  // -- VideoSDK Hook --
  const { displayName, webcamStream, micStream, webcamOn, micOn, isLocal } =
    useParticipant(participantId)

  const name = displayName
  const videoOn = webcamOn

  // Derive stable track references from the SDK stream wrappers.
  // The SDK may return a new stream wrapper object on every render even when
  // the underlying track has not changed. By depending on the track objects
  // (which are stable SDK references), we only create a new MediaStream when
  // a genuine track change occurs — preventing endless srcObject reassignments
  // and AudioContext restarts in useAudioLevel.
  const videoTrack = webcamStream?.track ?? null
  const audioTrack = micStream?.track ?? null

  useEffect(() => {
    console.log(`👤 [VideoTile][${participantId}] JOINED`)
  }, [])

  const prevMicRef = useRef(micOn)

  useEffect(() => {
    if (prevMicRef.current !== micOn) {
      if (micOn) {
        console.log(`🎤 [VideoTile][${participantId}] MIC ON`)
      } else {
        console.log(`🔇 [VideoTile][${participantId}] MIC OFF`)
      }

      prevMicRef.current = micOn
    }
  }, [micOn])

  useEffect(() => {
    if (audioTrack) {
      console.log(`🎧 [VideoTile][${participantId}] AUDIO READY`, {
        id: audioTrack.id,
        state: audioTrack.readyState,
      })
    }
  }, [audioTrack])

  const sdkStream = useMemo(() => {
    const hasAudio = audioTrack && micOn
    const hasVideo = videoTrack && webcamOn

    // 🚨 Prevent invalid state: mic ON but no track yet
    if (micOn && !audioTrack) {
      console.log(`⏳ [VideoTile][${participantId}] Waiting for audio track...`)
    }

    const tracks = []

    if (hasVideo) tracks.push(videoTrack)
    if (hasAudio) tracks.push(audioTrack)

    return tracks.length > 0 ? new MediaStream(tracks) : null
  }, [videoTrack, audioTrack, micOn, webcamOn])

  const stream = sdkStream

  // -- Existing Logic --
  const audioLevel = useAudioLevel(audioTrack)
  const isSpeaking = micOn && audioLevel > 5

  // Optional debug logging for RMS audio level
  // useEffect(() => {
  //   if (audioTrack) {
  //     console.log(`🔊 [VideoTile][${participantId}] RMS AUDIO LEVEL`, {
  //       rms: audioLevel.toFixed(2),
  //       micOn,
  //       trackId: audioTrack.id,
  //       readyState: audioTrack.readyState,
  //     })
  //   }
  // }, [audioLevel, micOn, audioTrack, participantId])

  const videoRef = useRef(null)

  // Check if stream actually has video tracks (Hardware check)
  const hasVideoTrack = stream && stream.getVideoTracks().length > 0
  const isVideoVisible = videoOn && hasVideoTrack

  useEffect(() => {
    if (!videoRef.current) return

    if (!stream) {
      videoRef.current.srcObject = null
      return
    }

    // Attach stream — autoPlay on the <video> element handles playback.
    // We must NOT call .play() here: it fires before user interaction and
    // triggers NotAllowedError under the browser's autoplay policy.
    videoRef.current.srcObject = stream
  }, [stream, participantId])

  return (
    <div
      className={`relative h-full w-full min-h-[150px] overflow-hidden rounded-lg bg-white border border-solid transition-[border-color,box-shadow] duration-200 ease-in-out ${
        isSpeaking
          ? "border-green-600 shadow-[0_0_15px_rgba(46,125,50,0.4)]"
          : "border-[#C6C6C6] shadow-sm"
      }`}
    >
      {/* Always render video if stream exists to ensure audio plays, hide if videoOn is false */}
      {stream && (
        <video
          autoPlay
          playsInline
          muted={isLocal}
          ref={videoRef}
          className={`h-full w-full object-cover ${isVideoVisible ? "block" : "hidden"}`}
          onError={() => {
            // Silenced video error
          }}
        />
      )}

      {/* Show Avatar if no stream OR video is off */}
      {(!stream || !isVideoVisible) && (
        <div className="flex h-full w-full items-center justify-center">
          {propAvatar ? (
            <img
              src={propAvatar}
              alt={name}
              className={`h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-full border-4 border-solid object-cover ${
                isSpeaking
                  ? "border-green-600 shadow-[0_0_15px_rgba(46,125,50,0.4)]"
                  : "border-[#C6C6C6] shadow-none"
              }`}
              onError={(e) => {
                // Hide if fails
                e.target.style.display = "none"
              }}
            />
          ) : (
            <div
              className={`flex h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-gray-200 text-2xl font-bold text-gray-600 border-4 border-solid ${
                isSpeaking
                  ? "border-green-600 shadow-[0_0_15px_rgba(46,125,50,0.4)]"
                  : "border-[#C6C6C6]"
              }`}
            >
              {(name || "?").charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      )}

      {/* Overlay Info */}
      <div className="absolute bottom-3 left-3 flex max-w-[70%] items-center gap-2">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap text-xs font-medium text-gray-900 sm:text-[0.8rem] md:text-sm">
          {name} {isLocal && "(You)"}
        </div>

        {isSpeaking && (
          <div className="flex h-3 items-end gap-[2px]">
            <div className="h-2 w-[3px] animate-[pulse_1s_ease-in-out_infinite] rounded-full bg-green-600" />
            <div className="h-3 w-[3px] animate-[pulse_1s_ease-in-out_infinite] rounded-full bg-green-600 delay-100" />
            <div className="h-[6px] w-[3px] animate-[pulse_1s_ease-in-out_infinite] rounded-full bg-green-600 delay-200" />
          </div>
        )}
      </div>

      {/* Status Icons */}
      <div className="absolute bottom-3 right-3 flex items-center gap-2">
        {!micOn && <MicOff className="h-[18px] w-[18px] text-red-500" />}
        {!videoOn && <VideoOff className="h-[18px] w-[18px] text-red-500" />}
      </div>
    </div>
  )
}

export default VideoTile
