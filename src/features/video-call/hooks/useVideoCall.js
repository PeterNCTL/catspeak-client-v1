import { useCallback } from "react"
import {
  useLocalParticipant,
  useRoomContext,
  useConnectionState,
} from "@livekit/components-react"
import { ConnectionState } from "livekit-client"
import toast from "react-hot-toast"

/**
 * Handles local mic/cam state + toggle actions using LiveKit.
 * Participant data (list, streams, per-participant mic/cam) should be read
 * from LiveKit hooks in the components that need them.
 *
 * @param {Object} t - Translation object (from useLanguage)
 */
export const useVideoCall = (t) => {
  const room = useRoomContext()
  const { localParticipant } = useLocalParticipant()
  const connectionState = useConnectionState()

  const isJoined = connectionState === ConnectionState.Connected

  const micOn = localParticipant?.isMicrophoneEnabled ?? false
  const cameraOn = localParticipant?.isCameraEnabled ?? false

  // Toggle mic — probes getUserMedia first to surface permission errors cleanly.
  const toggleAudio = useCallback(async () => {
    if (!localParticipant) return

    console.log(
      `[useVideoCall] 🎤 toggleAudio called — current micOn=${micOn}`,
    )

    if (!micOn) {
      let probe = null
      try {
        probe = await navigator.mediaDevices.getUserMedia({ audio: true })
        const audioTrack = probe.getAudioTracks()[0]

        console.log(
          `[useVideoCall] 🎤 Probe getUserMedia succeeded — ` +
            `track: readyState=${audioTrack?.readyState} ` +
            `enabled=${audioTrack?.enabled} ` +
            `muted=${audioTrack?.muted} ` +
            `label="${audioTrack?.label}"`,
        )

        // Check if the track is actually delivering audio data.
        if (audioTrack?.muted) {
          console.log(
            "[useVideoCall] ⏳ Track is muted — waiting up to 2s for unmute event...",
          )
          const unmuted = await new Promise((resolve) => {
            const onUnmute = () => {
              console.log(
                "[useVideoCall] ✅ Track unmuted within 2s — mic hardware is available",
              )
              resolve(true)
            }
            audioTrack.addEventListener("unmute", onUnmute, { once: true })
            setTimeout(() => {
              audioTrack.removeEventListener("unmute", onUnmute)
              resolve(false)
            }, 2000)
          })
          if (!unmuted) {
            console.warn(
              "[useVideoCall] 🔇 Mic track stayed muted after 2s — " +
                "another app likely holds exclusive mic access. Blocking toggle.",
            )
            toast.error(
              t?.rooms?.waitingScreen?.micInUse ??
                "Microphone is in use by another app.",
            )
            return
          }
        } else {
          console.log(
            "[useVideoCall] ✅ Track is NOT muted — mic hardware is available, proceeding",
          )
        }
      } finally {
        probe?.getTracks().forEach((t) => t.stop())
      }
    }

    console.log("[useVideoCall] 🎤 Calling LiveKit setMicrophoneEnabled()")
    await localParticipant.setMicrophoneEnabled(!micOn)
  }, [localParticipant, micOn, t])

  // Toggle webcam — probes getUserMedia first to surface permission errors cleanly.
  const toggleVideo = useCallback(async () => {
    if (!localParticipant) return

    if (!cameraOn) {
      let probe = null
      try {
        probe = await navigator.mediaDevices.getUserMedia({ video: true })
      } finally {
        probe?.getTracks().forEach((t) => t.stop())
      }
    }

    await localParticipant.setCameraEnabled(!cameraOn)
  }, [localParticipant, cameraOn])

  const leaveMeeting = useCallback(() => {
    room?.disconnect()
  }, [room])

  return {
    micOn,
    cameraOn,
    toggleAudio,
    toggleVideo,
    leaveMeeting,
    isJoined,
  }
}
