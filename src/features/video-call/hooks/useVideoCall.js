import { useRef, useEffect, useState } from "react"
import { useMeeting, useParticipant } from "@videosdk.live/react-sdk"

/**
 * Handles join/leave lifecycle and exposes local mic/cam state + toggle actions.
 * Participant data (list, streams, per-participant mic/cam) should be read directly
 * from useMeeting() / useParticipant() in the components that need them.
 */
export const useVideoCall = (sdkToken) => {
  const [isJoined, setIsJoined] = useState(false)

  const { join, leave, toggleMic, toggleWebcam, localParticipant } = useMeeting(
    {
      onMeetingJoined: () => {
        console.log("[useVideoCall] ✅ Has joined the meeting")
        setIsJoined(true)
      },
      onMeetingLeft: () => {
        console.log("[useVideoCall] ❌ Has left the meeting")
        setIsJoined(false)
      },
      onError: (error) => {
        console.error("[useVideoCall] VideoSDK Error:", error)
      },
    },
  )

  // Join once on mount; leave on unmount.
  const hasJoinedRef = useRef(false)

  useEffect(() => {
    // console.log("[useVideoCall] sdkToken:", sdkToken)
    if (!sdkToken) return
    if (hasJoinedRef.current) return

    const timeout = setTimeout(() => {
      console.log("[useVideoCall] ⏳ Joining meeting...")
      hasJoinedRef.current = true
      join()
    }, 500)

    return () => {
      clearTimeout(timeout)

      // ✅ Only leave if we actually joined
      if (hasJoinedRef.current) {
        console.log("[useVideoCall] 🚪 Leaving meeting...")
        leave()
        hasJoinedRef.current = false
      }
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
    isJoined,
  }
}
