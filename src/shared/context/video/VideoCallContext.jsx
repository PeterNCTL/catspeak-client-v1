import React, { createContext, useContext, useEffect, useState } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useGetProfileQuery } from "@/features/auth"
import { useVideoCall } from "@/features/video-call/hooks/useVideoCall"
import toast from "react-hot-toast"
import { useLanguage } from "@/shared/context/LanguageContext"

const VideoCallContext = createContext()

export const useVideoCallContext = () => useContext(VideoCallContext)

// Internal component that has access to MeetingContext (provided by MeetingProvider upstream)
export const VideoCallContent = ({
  children,
  session,
  joinSession,
  leaveSession,
  sessionError,
  sdkReady,
  sdkToken,
}) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLanguage()

  // Local UI state (Sync with passed state, default to off)
  const [micOn, setMicOn] = useState(location.state?.micEnabled || false)
  const [cameraOn, setCameraOn] = useState(
    location.state?.webcamEnabled || false,
  )
  const [showChat, setShowChat] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)
  const [hasJoined, setHasJoined] = useState(true) // Always join immediately when on this route
  const [videoTrack, setVideoTrack] = useState(null)
  const [audioTrack, setAudioTrack] = useState(null)

  // -- Preview Stream Logic --

  // Video Track Management
  useEffect(() => {
    if (hasJoined) {
      setVideoTrack((prev) => {
        if (prev) prev.stop()
        return null
      })
      return
    }

    let active = true
    let newTrack = null

    const updateVideo = async () => {
      if (cameraOn) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          })
          newTrack = stream.getVideoTracks()[0]
          if (active) setVideoTrack(newTrack)
          else newTrack.stop()
        } catch (err) {
          console.error("Error getting video:", err)
        }
      } else {
        setVideoTrack(null)
      }
    }

    updateVideo()

    return () => {
      active = false
      if (newTrack) newTrack.stop()
      setVideoTrack((prev) => {
        if (prev) prev.stop()
        return null
      })
    }
  }, [hasJoined, cameraOn])

  // Audio Track Management (Similar logic)
  useEffect(() => {
    if (hasJoined) {
      setAudioTrack((prev) => {
        if (prev) prev.stop()
        return null
      })
      return
    }

    let active = true
    let newTrack = null

    const updateAudio = async () => {
      if (micOn) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          })
          newTrack = stream.getAudioTracks()[0]
          if (active) setAudioTrack(newTrack)
          else newTrack.stop()
        } catch (err) {
          console.error("Error getting audio:", err)
        }
      } else {
        setAudioTrack(null)
      }
    }

    updateAudio()

    return () => {
      active = false
      if (newTrack) newTrack.stop()
      setAudioTrack((prev) => {
        if (prev) prev.stop()
        return null
      })
    }
  }, [hasJoined, micOn])

  // Combine tracks into stream
  const [previewStream, setPreviewStream] = useState(null)
  useEffect(() => {
    const tracks = []
    if (videoTrack) tracks.push(videoTrack)
    if (audioTrack) tracks.push(audioTrack)

    if (tracks.length > 0) {
      setPreviewStream(new MediaStream(tracks))
    } else {
      setPreviewStream(null)
    }
  }, [videoTrack, audioTrack])

  const { data: userData, isLoading: isLoadingUser } = useGetProfileQuery()
  const user = userData?.data
  const currentUserId = user?.accountId

  // Gate join() until provider is mounted, meetingId exists, token exists, and sdkReady=true
  const [providerMounted, setProviderMounted] = useState(false)
  useEffect(() => {
    setProviderMounted(true)
  }, [])

  const shouldJoinMeeting =
    sdkReady && !!session?.videoSdkMeetingId && !!sdkToken && providerMounted

  const {
    participants,
    messages,
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

  // Sync local UI toggles with hook actions
  const handleToggleMic = async () => {
    const newState = !micOn
    try {
      await toggleAudio(newState)
      setMicOn(newState)
    } catch (err) {
      console.error("Failed to toggle mic:", err)
      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError" ||
        err.name === "NotReadableError"
      ) {
        toast.error(t.rooms.videoCall.error.micPermission)
      } else {
        toast.error(t.rooms.videoCall.error.toggleMic)
      }
    }
  }

  const handleToggleCam = async () => {
    const newState = !cameraOn
    try {
      await toggleVideo(newState)
      setCameraOn(newState)
    } catch (err) {
      console.error("Failed to toggle camera:", err)
      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError" ||
        err.name === "NotReadableError"
      ) {
        toast.error(t.rooms.videoCall.error.camPermission)
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

    const communityLanguage = localStorage.getItem("communityLanguage") || "en"
    navigate(`/${communityLanguage}/community`)
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
    setMicOn,
    cameraOn,
    setCameraOn,
    showChat,
    setShowChat,
    showParticipants,
    setShowParticipants,
    hasJoined,
    setHasJoined,
    user,
    isLoadingUser,
    currentUserId,
    session,
    sessionError,

    // Normalized Data
    activeParticipants: participants,
    messages,
    isConnected,
    localStream: hasJoined ? localMediaStream : previewStream, // preview or live MediaStream

    // Actions
    handleToggleMic,
    handleToggleCam,
    handleSendMessage,
    handleLeaveSession,
    handleCopyLink,

    // Legacy support if needed
    connection: null,
    peers: {},
  }

  return (
    <VideoCallContext.Provider value={value}>
      {children}
    </VideoCallContext.Provider>
  )
}
