import React, { useState, useEffect, useRef } from "react"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { useGetRoomByIdQuery } from "@/store/api/roomsApi"
import {
  useGetActiveVideoSessionsQuery,
  useJoinVideoSessionMutation,
  useCreateVideoSessionMutation,
} from "@/store/api/videoSessionsApi"
import useAuth from "@/hooks/useAuth"
import WaitingScreen from "@/components/waiting-room/WaitingScreen"
import { useLanguage } from "@/context/LanguageContext"
import { Snackbar, Alert } from "@mui/material"

const RoomDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { t } = useLanguage()

  // Auth & Room Data
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      navigate("/")
    }
  }, [user, navigate])

  const {
    data: room,
    isLoading: isLoadingRoom,
    error,
  } = useGetRoomByIdQuery(id)

  const {
    data: activeSessions,
    isLoading: isLoadingSessions,
    refetch: refetchActiveSessions,
  } = useGetActiveVideoSessionsQuery()

  const [joinVideoSession, { isLoading: isJoining }] =
    useJoinVideoSessionMutation()
  const [createVideoSession, { isLoading: isCreating }] =
    useCreateVideoSessionMutation()

  const activeSession = activeSessions?.find((s) => s.roomId === parseInt(id))

  // -- Media Preview State --
  const [micOn, setMicOn] = useState(true)
  const [cameraOn, setCameraOn] = useState(true)

  const [videoTrack, setVideoTrack] = useState(null)
  const [audioTrack, setAudioTrack] = useState(null)
  const [localStream, setLocalStream] = useState(null)

  // -- Snackbar State --
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error", // 'error' | 'warning' | 'info' | 'success'
  })

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setSnackbar({ ...snackbar, open: false })
  }

  // -- Media Effects (Copied/Adapted from VideoCallContext logic) --
  useEffect(() => {
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
          if (
            err.name === "NotAllowedError" ||
            err.name === "PermissionDeniedError" ||
            err.name === "NotReadableError"
          ) {
            setCameraOn(false)
            setSnackbar({
              open: true,
              message: t.rooms.waitingScreen.cameraAccessError,
              severity: "error",
            })
          }
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
  }, [cameraOn])

  useEffect(() => {
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
          if (
            err.name === "NotAllowedError" ||
            err.name === "PermissionDeniedError" ||
            err.name === "NotReadableError"
          ) {
            setMicOn(false)
            setSnackbar({
              open: true,
              message: t.rooms.waitingScreen.micAccessError,
              severity: "error",
            })
          }
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
  }, [micOn])

  useEffect(() => {
    const tracks = []
    if (videoTrack) tracks.push(videoTrack)
    if (audioTrack) tracks.push(audioTrack)

    if (tracks.length > 0) {
      setLocalStream(new MediaStream(tracks))
    } else {
      setLocalStream(null)
    }
  }, [videoTrack, audioTrack])

  // -- Handlers --

  const handleJoin = async () => {
    try {
      let sessionId

      if (activeSession) {
        // Session exists -> Join it explicitly
        sessionId = activeSession.sessionId
        await joinVideoSession(sessionId).unwrap()
      } else {
        // No session → create new session
        try {
          const newSession = await createVideoSession({
            roomId: parseInt(id),
          }).unwrap()
          sessionId = newSession.sessionId
        } catch (err) {
          console.warn(
            "Create session failed, checking for active session...",
            err,
          )
          const { data: refreshedSessions } = await refetchActiveSessions()
          const retrySession = refreshedSessions?.find(
            (s) => s.roomId === parseInt(id),
          )

          if (retrySession) {
            sessionId = retrySession.sessionId
          } else {
            console.error("Failed to create or join session:", err)
            setSnackbar({
              open: true,
              message: t.rooms.waitingScreen.createSessionError,
              severity: "error",
            })
            return
          }
        }
      }

      // Preserve language param
      const search = searchParams.toString()
      const searchStr = search ? `?${search}` : ""

      navigate({
        pathname: `/meet/${sessionId}`,
        search: searchStr,
      })
    } catch (err) {
      console.error("Failed to process join:", err)
      setSnackbar({
        open: true,
        message: t.rooms.waitingScreen.joinError,
        severity: "error",
      })
    }
  }

  // -- Render --

  if (isLoadingRoom || isLoadingSessions) {
    return (
      <div className="flex h-screen items-center justify-center bg-white text-gray-500">
        {t.rooms.waitingScreen.loading}
      </div>
    )
  }

  if (error || !room) {
    return (
      <div className="flex h-screen items-center justify-center bg-white text-red-500">
        {t.rooms.waitingScreen.roomNotFound}
      </div>
    )
  }

  // We pass the "Room" object as "session" to WaitingScreen for title/name?
  // WaitingScreen expects session.name or session.roomName.
  // We can construct a mock session object if activeSession is missing so UI looks good.
  const displaySession = activeSession || {
    name: room.name,
    roomName: room.name,
    participants: [],
  }

  return (
    <>
      <WaitingScreen
        session={displaySession}
        localStream={localStream}
        micOn={micOn}
        cameraOn={cameraOn}
        user={user}
        onToggleMic={() => setMicOn(!micOn)}
        onToggleCam={() => setCameraOn(!cameraOn)}
        onJoin={handleJoin}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default RoomDetailPage
