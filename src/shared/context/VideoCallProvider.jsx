import React, { useEffect, useRef, useState } from "react"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import { LiveKitRoom } from "@livekit/components-react"
import { SearchX, Users, AlertCircle } from "lucide-react"

import { useGetProfileQuery } from "@/features/auth"
import {
  useGetVideoSessionByIdQuery,
  useGetLiveKitTokenMutation,
} from "@/store/api/videoSessionsApi"
import { useGetRoomByIdQuery } from "@/features/rooms"
import PillButton from "@/shared/components/ui/buttons/PillButton"
import { useLanguage } from "@/shared/context/LanguageContext"
import { getCommunityPath } from "@/shared/utils/navigation"
import VideoCallLoading from "@/features/video-call/components/VideoCallLoading"
import { VideoCallContent } from "./VideoCallContext"

export const VideoCallProvider = ({ children }) => {
  const { id, lang } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { t, language } = useLanguage()

  const [liveKitToken, setLiveKitToken] = useState(null)
  const [serverUrl, setServerUrl] = useState(null)
  const hasInitRef = useRef(false)

  const { data: userData } = useGetProfileQuery()
  const user = userData?.data ?? null

  const {
    data: session,
    isLoading: isLoadingSession,
    error: sessionError,
  } = useGetVideoSessionByIdQuery(id, { skip: !id })

  const [getLiveKitToken] = useGetLiveKitTokenMutation()

  const { data: room, isLoading: isLoadingRoom } = useGetRoomByIdQuery(
    session?.roomId,
    { skip: !session?.roomId },
  )

  const isUserParticipant = session?.participants?.some(
    (p) => p.accountId === user?.accountId,
  )

  const isRoomFull =
    room &&
    room.maxParticipants !== null &&
    (room.currentParticipantCount || 0) >= room.maxParticipants &&
    !isUserParticipant

  // Fetch the LiveKit token once all prerequisites are ready.
  useEffect(() => {
    if (!id || !session || !user || isLoadingRoom || isRoomFull) return
    if (hasInitRef.current) return

    const initConnection = async () => {
      try {
        hasInitRef.current = true

        const res = await getLiveKitToken({
          roomId: session.roomId,
          participantName: user.username,
        }).unwrap()

        const token = res?.participant_token
        const url = res?.server_url

        if (!token || !url) {
          throw new Error("Invalid LiveKit token response from backend")
        }

        setLiveKitToken(token)
        setServerUrl(url)
      } catch (err) {
        console.error("[VideoCall] LiveKit token init failed:", err)
        hasInitRef.current = false // allow retry on next render
      }
    }

    initConnection()
  }, [id, session, user, getLiveKitToken, isLoadingRoom, isRoomFull])

  // --- Loading / error guards ---

  if (isRoomFull) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-950 animate-fadeIn">
        <div className="flex flex-col items-center gap-4 max-w-[400px] px-8 py-12 text-center">
          <div className="text-orange-500 mb-2">
            <Users size={64} strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-white leading-tight">
            {t.rooms.roomFullModal.title}
          </h1>
          <p className="text-[15px] text-gray-400 leading-relaxed mb-2">
            {t.rooms.roomFullModal.message}
          </p>
          <PillButton
            onClick={() => navigate(getCommunityPath(lang || language))}
            className="h-10 min-w-[140px] mt-2"
          >
            {t.rooms.waitingScreen.backToCommunity}
          </PillButton>
        </div>
      </div>
    )
  }

  if (sessionError) {
    console.error("Failed to load session:", sessionError)
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-950 animate-fadeIn">
        <div className="flex flex-col items-center gap-4 max-w-[400px] px-8 py-12 text-center">
          <div className="text-red-500 mb-2">
            <AlertCircle size={64} strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-white leading-tight">
            {t.rooms.videoCall.provider.failedToLoad}
          </h1>
          <p className="text-[15px] text-gray-400 leading-relaxed mb-2">
            {sessionError?.data?.message ||
              t.rooms.videoCall.provider.unknownError}
          </p>
          <div className="flex flex-col gap-3 w-full mt-2 min-w-[200px]">
            <PillButton
              onClick={() => window.location.reload()}
              variant="primary"
              className="h-10 w-full"
            >
              {t.rooms.videoCall.provider.retry}
            </PillButton>
            <PillButton
              onClick={() => navigate(getCommunityPath(lang || language))}
              variant="secondary"
              className="h-10 w-full"
            >
              {t.rooms.waitingScreen.backToCommunity}
            </PillButton>
          </div>
        </div>
      </div>
    )
  }

  if (!isLoadingSession && !session) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-950 animate-fadeIn">
        <div className="flex flex-col items-center gap-4 max-w-[400px] px-8 py-12 text-center">
          <div className="text-red-500 mb-2">
            <SearchX size={64} strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-white leading-tight">
            {t.rooms.waitingScreen.roomNotFound}
          </h1>
          <p className="text-[15px] text-gray-400 leading-relaxed mb-2">
            {t.rooms.waitingScreen.roomNotFoundSubtext}
          </p>
          <PillButton
            onClick={() => navigate(getCommunityPath(lang || language))}
            variant="primary"
            className="h-10 min-w-[140px] mt-2"
          >
            {t.rooms.waitingScreen.backToCommunity}
          </PillButton>
        </div>
      </div>
    )
  }

  // Show a single loading screen until session, room, and LiveKit token are all ready.
  if (
    isLoadingSession ||
    !userData ||
    (session?.roomId && isLoadingRoom) ||
    !liveKitToken ||
    !serverUrl
  ) {
    return (
      <VideoCallLoading
        message={t.rooms.videoCall.provider.connecting ?? "Connecting..."}
      />
    )
  }

  const initMic = location.state?.micEnabled ?? false
  const initCam = location.state?.webcamEnabled ?? false

  return (
    <LiveKitRoom
      serverUrl={serverUrl}
      token={liveKitToken}
      connect={true}
      audio={initMic}
      video={initCam}
      onDisconnected={() => {
        console.log("[VideoCallProvider] LiveKit disconnected")
      }}
      onError={(err) => {
        console.error("[VideoCallProvider] LiveKit error:", err)
      }}
      style={{ display: "contents" }}
    >
      <VideoCallContent
        user={user}
        session={session}
        sessionError={sessionError}
      >
        {children}
      </VideoCallContent>
    </LiveKitRoom>
  )
}
