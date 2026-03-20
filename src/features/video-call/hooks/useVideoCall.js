import { useRef, useEffect } from "react"
import { useMeeting, useParticipant } from "@videosdk.live/react-sdk"

/**
 * Handles join/leave lifecycle and exposes local mic/cam state + toggle actions.
 * Participant data (list, streams, per-participant mic/cam) should be read directly
 * from useMeeting() / useParticipant() in the components that need them.
 */
export const useVideoCall = (sdkToken) => {
  const { join, leave, toggleMic, toggleWebcam, localParticipant } = useMeeting(
    {
      onError: (error) => {
        console.error("[useVideoCall] VideoSDK Error:", error)
      },
    },
  )

  // Join once on mount; leave on unmount.
  const hasJoinedRef = useRef(false)
  useEffect(() => {
    console.log("[useVideoCall] sdkToken:", sdkToken)
    if (!sdkToken) return
    if (hasJoinedRef.current) return

    const timeout = setTimeout(() => {
      hasJoinedRef.current = true
      join()
    }, 500)

    return () => {
      clearTimeout(timeout)
      leave()
    }
  }, [sdkToken]) // join/leave are stable SDK references

  // Reactive local mic/cam state via useParticipant (more reliable than useMeeting).
  const { micOn, webcamOn } = useParticipant(localParticipant?.id ?? "")

  // Toggle mic — probes getUserMedia first to surface permission errors cleanly.
  const toggleAudio = async () => {
    if (!micOn) {
      let probe = null
      try {
        probe = await navigator.mediaDevices.getUserMedia({ audio: true })
      } finally {
        probe?.getTracks().forEach((t) => t.stop())
      }
    }
    toggleMic()
  }

  // Toggle webcam — probes getUserMedia first to surface permission errors cleanly.
  const toggleVideo = async () => {
    if (!webcamOn) {
      let probe = null
      try {
        probe = await navigator.mediaDevices.getUserMedia({ video: true })
      } finally {
        probe?.getTracks().forEach((t) => t.stop())
      }
    }
    toggleWebcam()
  }

  return {
    micOn: micOn ?? false,
    cameraOn: webcamOn ?? false,
    toggleAudio,
    toggleVideo,
    leaveMeeting: leave,
  }
}
