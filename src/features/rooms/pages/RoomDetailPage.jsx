import React, { useState, useEffect, useRef } from "react"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import {
  useGetRoomByIdQuery,
  WaitingScreen,
  useMediaPreview,
} from "@/features/rooms"
import {
  useGetActiveVideoSessionsQuery,
  useJoinVideoSessionMutation,
  useCreateVideoSessionMutation,
} from "@/store/api/videoSessionsApi"
import { useAuth } from "@/features/auth"
import { useLanguage } from "@/shared/context/LanguageContext"
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
  const currentParticipantCount = room?.currentParticipantCount ?? 0
  const maxParticipants = room?.maxParticipants ?? null
  const isRoomFull =
    maxParticipants !== null && currentParticipantCount >= maxParticipants

  // -- Snackbar State --
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error", // 'error' | 'warning' | 'info' | 'success'
  })

  // -- Media Preview Hook --
  const { micOn, cameraOn, localStream, toggleMic, toggleCamera } =
    useMediaPreview({
      onError: (type) => {
        setSnackbar({
          open: true,
          message:
            type === "camera"
              ? t.rooms.waitingScreen.cameraAccessError
              : t.rooms.waitingScreen.micAccessError,
          severity: "error",
        })
      },
    })

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setSnackbar({ ...snackbar, open: false })
  }

  // -- Handlers --

  const handleJoin = async () => {
    try {
      if (isRoomFull) {
        setSnackbar({
          open: true,
          message: t.rooms.waitingScreen.roomFull,
          severity: "warning",
        })
        return
      }

      let sessionId

      if (activeSession) {
        try {
          // Session exists -> Join it explicitly
          await joinVideoSession(activeSession.sessionId).unwrap()
          sessionId = activeSession.sessionId
        } catch (err) {
          console.warn(
            "Failed to join active session, falling back to create:",
            err,
          )
        }
      }

      if (!sessionId) {
        // No session or failed to join -> create new session
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

      navigate(
        {
          pathname: `/meet/${sessionId}`,
          search: searchStr,
        },
        {
          state: {
            micEnabled: micOn,
            webcamEnabled: cameraOn,
          },
        },
      )
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
        participantCount={currentParticipantCount}
        localStream={localStream}
        micOn={micOn}
        cameraOn={cameraOn}
        user={user}
        onToggleMic={toggleMic}
        onToggleCam={toggleCamera}
        onJoin={handleJoin}
        isFull={isRoomFull}
        maxParticipants={maxParticipants}
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
