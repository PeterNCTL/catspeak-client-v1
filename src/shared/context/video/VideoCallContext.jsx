import React, { createContext, useContext, useEffect, useState } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useMeeting, usePubSub } from "@videosdk.live/react-sdk"
import { useVideoCall } from "@/features/video-call/hooks/useVideoCall"
import toast from "react-hot-toast"
import { useLanguage } from "@/shared/context/LanguageContext"
import { getCommunityPath } from "@/shared/utils/navigation"
import { useLeaveVideoSessionMutation } from "@/store/api/videoSessionsApi"
import { handleMediaError } from "@/shared/utils/mediaErrorUtils"

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
    micOn,
    cameraOn,
    toggleAudio,
    toggleVideo,
    leaveMeeting,
    isConnected,
  } = useVideoCall(shouldJoinMeeting, {
    meetingId: session?.videoSdkMeetingId,
    token: sdkToken,
    providerMounted,
  })

  // -- Chat Logic (moved from useVideoCall) --
  const { publish, messages } = usePubSub("CHAT", {
    onMessageReceived: (message) => {
      // console.log("New Message", message)
    },
    onOldMessagesReceived: (messages) => {
      // console.log("Old Messages", messages)
    },
  })

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

  const handleSendMessage = (text) => {
    publish(text, { persist: true })
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
