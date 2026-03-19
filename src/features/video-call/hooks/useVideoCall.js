import { useState, useEffect, useMemo, useRef } from "react"
import { useMeeting, useParticipant } from "@videosdk.live/react-sdk"

export const useVideoCall = (
  shouldJoin = false,
  { meetingId, token, providerMounted, sdkReady },
) => {
  // -- VideoSDK Hooks --
  const {
    join,
    leave,
    participants: sdkParticipants,
    localParticipant,
    toggleMic,
    toggleWebcam,
  } = useMeeting({
    onMeetingJoined: () => {
      // console.log("[useVideoCall] Meeting Joined")
    },
    onMeetingLeft: () => {
      // console.log("[useVideoCall] Meeting Left")
    },
    onError: (error) => {
      console.error("[useVideoCall] VideoSDK Error:", error)
    },
  })


  // values: null | "BLOCKED" | "NOT_FOUND" | "IN_USE" | "UNKNOWN"

  // -- Lifecycle --
  const hasJoinedRef = useRef(false)
  const joinKeyRef = useRef("")

  // Reset join guard if meetingId/token changes (fresh token / new meeting)
  useEffect(() => {
    const joinKey = `${meetingId || ""}:${token || ""}`
    if (joinKeyRef.current !== joinKey) {
      joinKeyRef.current = joinKey
      hasJoinedRef.current = false
    }
  }, [meetingId, token])

  useEffect(() => {
    if (!shouldJoin) return
    if (hasJoinedRef.current) return

    hasJoinedRef.current = true
    join()
  }, [shouldJoin, join])

  // -- Helpers to map participants for UI --
  // NOTE: We intentionally do NOT build MediaStream objects here.
  // Creating `new MediaStream(tracks)` on every render produces a new object
  // identity each time, which causes the <video> srcObject to be constantly
  // reassigned and the AudioContext chain to be restarted — breaking audio
  // delivery for some peers in calls with 3+ participants.
  //
  // Participants are plain descriptor objects. VideoTile constructs its own
  // stable MediaStream via useParticipant(), memoized on track identity.
  const mappedParticipants = useMemo(() => {
    const participantsArr = []

    if (localParticipant) {
      const { displayName, id } = localParticipant

      participantsArr.push({
        id,
        accountId: localParticipant.metaData?.accountId || null,
        username: displayName,
        isMicOn: localParticipant.micOn,
        isCameraOn: localParticipant.webcamOn,
        isActive: true,
        isLocal: true,
      })
    }

    // Remote Participants
    const localId = localParticipant?.id

    Array.from(sdkParticipants.values()).forEach((participant) => {
      // Skip if it is the local user
      if (participant.id === localId) return

      const { displayName, id, metaData } = participant

      participantsArr.push({
        id,
        accountId: metaData?.accountId || null,
        username: displayName,
        isMicOn: participant.micOn,
        isCameraOn: participant.webcamOn,
        isActive: true,
        isLocal: false,
      })
    })

    // De-duplicate by accountId so the same logged-in account
    // opening the meeting in multiple tabs/devices does not
    // appear as multiple distinct participants in the UI.
    //
    // IMPORTANT: Only use accountId as the key when it is a real non-empty
    // value. Using p.id as fallback prevents two participants whose accountId
    // was not yet propagated from colliding on the key "null".
    const uniqueByAccountId = []
    const seenKeys = new Set()

    for (const p of participantsArr) {
      const key = p.accountId ? String(p.accountId) : `__sdkid__${p.id}`
      if (seenKeys.has(key)) continue
      seenKeys.add(key)
      uniqueByAccountId.push(p)
    }

    return uniqueByAccountId
  }, [
    sdkParticipants,
    localParticipant,
    localParticipant?.webcamOn,
    localParticipant?.micOn,
  ])


  // -- Reactive local participant state --
  // useParticipant subscribes to per-participant events (mic/webcam toggles),
  // so micOn/cameraOn here will always re-render when the SDK fires changes.
  // Reading localParticipant.micOn directly from useMeeting() is NOT reliably
  // reactive for those properties.
  const { micOn: localMicOn, webcamOn: localWebcamOn } = useParticipant(
    localParticipant?.id || "",
  )

  const micOn = localMicOn ?? false
  const cameraOn = localWebcamOn ?? false

  // -- Actions --


  const toggleAudio = async () => {
    if (!micOn) {
      // Turning ON — probe getUserMedia to detect permission denied or no device
      let probeStream = null
      try {
        probeStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      } catch (err) {
        throw err
        // Unknown error — proceed optimistically
      } finally {
        // Stop probe tracks immediately; we only needed them to check access
        probeStream?.getTracks().forEach((t) => t.stop())
      }
    }
    return toggleMic()
  }

  const toggleVideo = async () => {
    if (!cameraOn) {
      // Turning ON — probe getUserMedia to detect permission denied or no device
      let probeStream = null
      try {
        probeStream = await navigator.mediaDevices.getUserMedia({ video: true })
      } catch (err) {
        throw err
      } finally {
        // Stop probe tracks immediately; we only needed them to check access
        probeStream?.getTracks().forEach((t) => t.stop())
      }
    }
    return toggleWebcam()
  }

  return {
    participants: mappedParticipants,
    micOn,
    cameraOn,
    toggleAudio,
    toggleVideo,
    leaveMeeting: leave,
    isConnected: !!localParticipant, // Rough check
    localParticipant, // Exposed for raw access if needed
  }
}
