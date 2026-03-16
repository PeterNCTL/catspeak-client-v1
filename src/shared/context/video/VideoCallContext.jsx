import React, { createContext, useContext, useEffect, useState } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useVideoCall } from "@/features/video-call/hooks/useVideoCall"
import toast from "react-hot-toast"
import { useLanguage } from "@/shared/context/LanguageContext"
import { getCommunityPath } from "@/shared/utils/navigation"
import { useLeaveVideoSessionMutation } from "@/store/api/videoSessionsApi"

const VideoCallContext = createContext()

export const useVideoCallContext = () => {
  const context = useContext(VideoCallContext)

  if (!context) {
    throw new Error("useVideoCallContext must be used within VideoCallContent")
  }

  return context
}

// Internal component that has access to MeetingContext (provided by MeetingProvider upstream)
export const VideoCallContent = ({
  children,
  user,
  session,
  sessionError,
  sdkReady,
  sdkToken,
}) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { t, language } = useLanguage()

  // UI-only state
  const [showChat, setShowChat] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)

  const currentUserId = user?.accountId

  // Gate join() until provider is mounted, meetingId exists, token exists, and sdkReady=true
  const [providerMounted, setProviderMounted] = useState(false)
  const [leaveSession] = useLeaveVideoSessionMutation()

  useEffect(() => {
    setProviderMounted(true)
  }, [])

  const shouldJoinMeeting =
    sdkReady && !!session?.videoSdkMeetingId && !!sdkToken && providerMounted

  const {
    participants,
    messages,
    micOn,
    cameraOn,
    toggleAudio,
    toggleVideo,
    sendMessage,
    leaveMeeting,
    isConnected,
    localMediaStream,
  } = useVideoCall(shouldJoinMeeting, {
    meetingId: session?.videoSdkMeetingId,
    token: sdkToken,
    providerMounted,
  })

  const handleToggleMic = async () => {
    try {
      await toggleAudio()
    } catch (err) {
      console.error("Failed to toggle mic:", err)
      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError" ||
        err.name === "NotFoundError" ||
        err.name === "DevicesNotFoundError" ||
        err.name === "NotReadableError" ||
        err.name === "TrackStartError"
      ) {
        toast.error(t.rooms.waitingScreen.micAccessError)
      } else {
        toast.error(t.rooms.videoCall.error.toggleMic)
      }
    }
  }

  const handleToggleCam = async () => {
    try {
      await toggleVideo()
    } catch (err) {
      console.error("Failed to toggle camera:", err)
      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError" ||
        err.name === "NotFoundError" ||
        err.name === "DevicesNotFoundError" ||
        err.name === "NotReadableError" ||
        err.name === "TrackStartError"
      ) {
        toast.error(t.rooms.waitingScreen.cameraAccessError)
      } else {
        toast.error(t.rooms.videoCall.error.toggleCam)
      }
    }
  }

  const handleSendMessage = (text) => {
    sendMessage(text)
  }

  const handleLeaveSession = async () => {
    // 1. Notify backend
    if (id) {
      try {
        await leaveSession(id).unwrap()
      } catch (error) {
        console.error("Failed to leave session api:", error)
      }
    }
    // 2. Leave VideoSDK meeting
    leaveMeeting()

    navigate(getCommunityPath(language))
  }

  const handleCopyLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    toast.success("Link copied to clipboard!")
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
    currentUserId,
    session,
    sessionError,

    // Normalized Data
    activeParticipants: participants,
    messages,
    isConnected,
    localStream: localMediaStream,

    // Actions
    handleToggleMic,
    handleToggleCam,
    handleSendMessage,
    handleLeaveSession,
    handleCopyLink,
  }

  return (
    <VideoCallContext.Provider value={value}>
      {children}
    </VideoCallContext.Provider>
  )
}
