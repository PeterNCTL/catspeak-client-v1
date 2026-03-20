import React, { useEffect, useRef, useState } from "react"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import { MeetingProvider } from "@videosdk.live/react-sdk"

import { useGetProfileQuery } from "@/features/auth"
import {
  useGetVideoSessionByIdQuery,
  useGetVideoSdkTokenMutation,
} from "@/store/api/videoSessionsApi"
import { useGetRoomByIdQuery } from "@/features/rooms"
import PillButton from "@/shared/components/ui/PillButton"
import { meetingConfig } from "@/shared/utils/videoSdkConfig"
import { useLanguage } from "@/shared/context/LanguageContext"
import { getCommunityPath } from "@/shared/utils/navigation"

import { VideoCallContent } from "./VideoCallContext"

export const VideoCallProvider = ({ children }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { t, language } = useLanguage()

  const [sdkToken, setSdkToken] = useState(null)
  const hasInitRef = useRef(false)

  const { data: userData } = useGetProfileQuery()
  const user = userData?.data ?? null

  const {
    data: session,
    isLoading: isLoadingSession,
    error: sessionError,
  } = useGetVideoSessionByIdQuery(id, { skip: !id })

  const [getVideoSdkToken] = useGetVideoSdkTokenMutation()

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

  // Fetch the VideoSDK token once all prerequisites are ready.
  useEffect(() => {
    if (!id || !session || !user || isLoadingRoom || isRoomFull) return
    if (hasInitRef.current) return

    const initMeeting = async () => {
      try {
        hasInitRef.current = true
        // console.log(
        //   "[VideoCall] Fetching VideoSDK token for meeting:",
        //   session.videoSdkMeetingId,
        // )

        const res = await getVideoSdkToken({
          meetingId: session.videoSdkMeetingId,
          name: user.username,
        }).unwrap()

        const token = res?.token
        // console.log("[VideoCall] Token fetched from backend:", res)

        if (typeof token !== "string" || token.trim().split(".").length !== 3) {
          throw new Error("Invalid VideoSDK token received from backend")
        }

        setSdkToken(token)
        // console.log("[VideoCall] sdkToken set in state ✅")
      } catch (err) {
        console.error("[VideoCall] Meeting init failed:", err)
        hasInitRef.current = false // allow retry on next render
      }
    }

    initMeeting()
  }, [id, session, user, getVideoSdkToken, isLoadingRoom, isRoomFull])

  // --- Loading / error guards ---

  if (isRoomFull) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-neutral-950 text-white gap-4">
        <p className="text-xl font-bold">{t.rooms.roomFullModal.title}</p>
        <p className="text-gray-400">{t.rooms.roomFullModal.message}</p>
        <PillButton
          onClick={() => navigate(getCommunityPath(language))}
          className="mt-2 min-w-[150px]"
        >
          {t.rooms.waitingScreen.backToCommunity}
        </PillButton>
      </div>
    )
  }

  if (sessionError) {
    console.error("Failed to load session:", sessionError)
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-950 text-white flex-col gap-4">
        <p className="text-red-500 text-xl">
          {t.rooms.videoCall.provider.failedToLoad}
        </p>
        <p className="text-gray-400 text-sm">
          {sessionError?.data?.message ||
            t.rooms.videoCall.provider.unknownError}
        </p>
        <div className="flex flex-col gap-3 min-w-[200px]">
          <PillButton
            onClick={() => window.location.reload()}
            variant="primary"
          >
            {t.rooms.videoCall.provider.retry}
          </PillButton>
          <PillButton
            onClick={() => navigate(getCommunityPath(language))}
            variant="secondary"
          >
            {t.rooms.waitingScreen.backToCommunity}
          </PillButton>
        </div>
      </div>
    )
  }

  if (!isLoadingSession && !session) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-950 text-white flex-col gap-4">
        <p className="text-red-500 text-xl">
          {t.rooms.waitingScreen.roomNotFound}
        </p>
        <p className="text-gray-400 text-sm text-center max-w-[400px]">
          {t.rooms.waitingScreen.roomNotFoundSubtext}
        </p>
        <PillButton
          onClick={() => navigate(getCommunityPath(language))}
          variant="primary"
        >
          {t.rooms.waitingScreen.backToCommunity}
        </PillButton>
      </div>
    )
  }

  // Show loading until we have a token (session + user must exist first).
  if (
    isLoadingSession ||
    !userData ||
    (session?.roomId && isLoadingRoom) ||
    !sdkToken
  ) {
    const message =
      sdkToken == null && session
        ? (t.rooms.videoCall.provider.preparingSession ??
          t.rooms.videoCall.provider.loadingSession)
        : t.rooms.videoCall.provider.loadingSession
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-950 text-white">
        <p>{message}</p>
      </div>
    )
  }

  const initMic = location.state?.micEnabled ?? false
  const initCam = location.state?.webcamEnabled ?? false

  return (
    <MeetingProvider
      config={{
        ...meetingConfig,
        meetingId: session.videoSdkMeetingId,
        micEnabled: initMic,
        webcamEnabled: initCam,
        name: user?.username || "Guest",
        metaData: {
          accountId: user?.accountId,
          username: user?.username,
        },
      }}
      token={sdkToken}
      joinWithoutUserInteraction={false}
    >
      <VideoCallContent
        user={user}
        session={session}
        sessionError={sessionError}
        sdkToken={sdkToken}
      >
        {children}
      </VideoCallContent>
    </MeetingProvider>
  )
}
