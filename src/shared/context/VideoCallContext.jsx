import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import {
  useRoomContext,
  useParticipants,
  useLocalParticipant,
  useConnectionState,
} from "@livekit/components-react"
import {
  ConnectionState,
  RoomEvent,
  DataPacket_Kind,
  Track,
} from "livekit-client"
import toast from "react-hot-toast"

import { useVideoCall, useScreenShare } from "@/features/video-call"
import { useLanguage } from "@/shared/context/LanguageContext"
import { getCommunityPath } from "@/shared/utils/navigation"
import { useLeaveVideoSessionMutation } from "@/store/api/videoSessionsApi"
import { handleMediaError } from "@/shared/utils/mediaErrorUtils"
import VideoCallLoading from "@/features/video-call/components/VideoCallLoading"

const VideoCallContext = createContext()

export const useVideoCallContext = () => {
  const context = useContext(VideoCallContext)
  if (!context)
    throw new Error("useVideoCallContext must be used within VideoCallProvider")
  return context
}

// ── Chat helpers (replaces VideoSDK PubSub) ──
function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function decodePacket(payload) {
  try {
    const text = new TextDecoder().decode(payload)
    const parsed = JSON.parse(text)
    if (parsed && parsed.type === "CHAT_MESSAGE" && parsed.payload)
      return parsed
    return null
  } catch {
    return null
  }
}

function encodePacket(payload) {
  return new TextEncoder().encode(
    JSON.stringify({ type: "CHAT_MESSAGE", payload }),
  )
}

/**
 * Renders inside LiveKitRoom. Owns all call-level state and actions,
 * then provides them via context.
 */
export const VideoCallContent = ({ children, user, session, sessionError }) => {
  const { id, lang } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { t, language } = useLanguage()

  // UI-only state
  const [showChat, setShowChat] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)

  const [leaveSession] = useLeaveVideoSessionMutation()

  // Track whether we've already left the session (to avoid double-calls)
  const hasLeftRef = useRef(false)

  const leaveSessionOnUnload = useCallback(() => {
    if (!id || hasLeftRef.current) return
    hasLeftRef.current = true

    // Use fetch with keepalive for reliable delivery during page unload
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "/api"
    const url = `${baseUrl}/video-sessions/${id}/participants`
    const token = localStorage.getItem("token")

    fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      keepalive: true,
    }).catch(() => {})
  }, [id])

  // Register beforeunload / pagehide to leave session when tab/window closes
  useEffect(() => {
    const handleBeforeUnload = () => {
      leaveSessionOnUnload()
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    window.addEventListener("pagehide", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      window.removeEventListener("pagehide", handleBeforeUnload)
    }
  }, [leaveSessionOnUnload])

  // LiveKit — room, participants, connection state
  const room = useRoomContext()
  const connectionState = useConnectionState()
  const participants = useParticipants()
  const { localParticipant } = useLocalParticipant()

  // Local mic/cam state + toggle actions
  const { micOn, cameraOn, toggleAudio, toggleVideo, leaveMeeting, isJoined } =
    useVideoCall(t)

  // Screen share state & actions
  const {
    screenShareOn,
    screenShareStream,
    presenterId: screenSharePresenterId,
    isLocalScreenShare,
    toggleScreenShare,
    presenterDisplayName,
  } = useScreenShare()

  // ── Chat via LiveKit data channels (replaces VideoSDK PubSub) ──
  const [messages, setMessages] = useState([])
  const messagesRef = useRef(messages)
  messagesRef.current = messages

  useEffect(() => {
    if (!room) return

    const handleDataReceived = (payload, participant) => {
      const packet = decodePacket(payload)
      if (!packet) return

      const data = packet.payload
      // Avoid duplicates
      if (messagesRef.current.some((m) => m.id === data.id)) return

      setMessages((prev) => [
        ...prev,
        {
          id: data.id,
          senderId: data.senderId,
          senderName:
            data.senderName ||
            participant?.name ||
            participant?.identity ||
            "Unknown",
          message: data.message,
          timestamp: data.timestamp,
        },
      ])
    }

    room.on(RoomEvent.DataReceived, handleDataReceived)
    return () => {
      room.off(RoomEvent.DataReceived, handleDataReceived)
    }
  }, [room])

  const handleToggleMic = async () => {
    try {
      await toggleAudio()
    } catch (err) {
      handleMediaError(err, "mic", t, { isToggle: true })
    }
  }

  const handleToggleCam = async () => {
    try {
      await toggleVideo()
    } catch (err) {
      handleMediaError(err, "camera", t, { isToggle: true })
    }
  }

  const handleToggleScreenShare = async () => {
    try {
      await toggleScreenShare()
    } catch (err) {
      console.error("[VideoCallContext] Screen share error:", err)
      toast.error(
        t?.rooms?.videoCall?.screenShare?.error ?? "Failed to share screen.",
      )
    }
  }

  const handleSendMessage = (text) => {
    if (!room?.localParticipant || !text.trim()) return

    const msg = {
      id: uid(),
      senderId: user?.accountId,
      senderName: user?.username || room.localParticipant.name || "Guest",
      message: text.trim(),
      timestamp: new Date().toISOString(),
    }

    const encoded = encodePacket(msg)
    room.localParticipant.publishData(encoded, {
      kind: DataPacket_Kind.RELIABLE,
    })

    // Add to local state immediately
    setMessages((prev) => [...prev, msg])
  }

  const handleLeaveSession = async () => {
    hasLeftRef.current = true // prevent unload handler from double-firing
    if (id) {
      try {
        await leaveSession(id).unwrap()
      } catch (error) {
        console.error("Failed to leave session:", error)
      }
    }
    leaveMeeting()
    navigate(getCommunityPath(lang || language))
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success("Link copied to clipboard!")
  }

  // Build a stable participant identity list for VideoGrid.
  // LiveKit participants already have unique identities.
  const participantIds = participants.map((p) => p.identity)

  const isConnected = connectionState === ConnectionState.Connected

  if (!isConnected) {
    return (
      <VideoCallLoading
        message={t.rooms.videoCall.provider.connecting ?? "Connecting..."}
      />
    )
  }

  const value = {
    id,
    navigate,
    location,
    micOn,
    cameraOn,
    showChat,
    setShowChat,
    showParticipants,
    setShowParticipants,
    user,
    currentUserId: user?.accountId,
    session,
    sessionError,
    participantIds,
    messages,
    isConnected,
    handleToggleMic,
    handleToggleCam,
    handleSendMessage,
    handleLeaveSession,
    handleCopyLink,
    // Screen share
    screenShareOn,
    screenShareStream,
    screenSharePresenterId,
    isLocalScreenShare,
    presenterDisplayName,
    handleToggleScreenShare,
  }

  return (
    <VideoCallContext.Provider value={value}>
      {children}
    </VideoCallContext.Provider>
  )
}
