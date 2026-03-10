import React, { useEffect, useRef, useState } from "react"
import { useParams, useLocation } from "react-router-dom"
import { MeetingProvider } from "@videosdk.live/react-sdk"

import { useGetProfileQuery } from "@/features/auth"
import {
  useGetVideoSessionByIdQuery,
  useLeaveVideoSessionMutation,
  useJoinVideoSessionMutation,
  useGetVideoSdkTokenMutation,
} from "@/store/api/videoSessionsApi"
import { meetingConfig } from "@/shared/utils/videoSdkConfig"
import { useLanguage } from "@/shared/context/LanguageContext"

import { VideoCallContent } from "./VideoCallContext"

export const VideoCallProvider = ({ children }) => {
  const { t } = useLanguage()
  const [sdkToken, setSdkToken] = useState(null)
  const [sdkReady, setSdkReady] = useState(false)

  const hasJoinedRef = useRef(false)

  const { id } = useParams()
  const { data: userData } = useGetProfileQuery()
  const user = userData?.data

  const {
    data: session,
    isLoading: isLoadingSession,
    error: sessionError,
  } = useGetVideoSessionByIdQuery(id, { skip: !id })

  const [joinSession] = useJoinVideoSessionMutation()
  const [leaveSession] = useLeaveVideoSessionMutation()
  const [getVideoSdkToken] = useGetVideoSdkTokenMutation()

  useEffect(() => {
    if (!id || !session || !user) return
    if (hasJoinedRef.current) return

    const initMeeting = async () => {
      try {
        hasJoinedRef.current = true

        // 1️⃣ Sync backend participation (currently disabled)
        // await joinSession(id).unwrap()

        // 2️⃣ Get a FRESH VideoSDK token
        const res = await getVideoSdkToken({
          meetingId: session.videoSdkMeetingId,
          name: user.username,
        }).unwrap()

        const token = res?.token
        if (typeof token !== "string" || token.trim().split(".").length !== 3) {
          throw new Error("Invalid VideoSDK token received from backend")
        }

        setSdkToken(token)
        setSdkReady(true)
      } catch (err) {
        console.error("Meeting init failed:", err)
      }
    }

    initMeeting()
  }, [id, session, user, getVideoSdkToken])

  // Loading state
  if (isLoadingSession || !userData) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-950 text-white">
        <p>{t.rooms.videoCall.provider.loadingSession}</p>
      </div>
    )
  }

  // Handle errors or missing session
  if (sessionError || (!isLoadingSession && !session)) {
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
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-neutral-800 rounded hover:bg-neutral-700 transition"
        >
          {t.rooms.videoCall.provider.retry}
        </button>
      </div>
    )
  }

  if (!sdkReady) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-950 text-white">
        <p>{t.rooms.videoCall.provider.connecting}</p>
      </div>
    )
  }

  // Read initial state from navigation (default to false if not set)
  const location = useLocation()
  const initMic = location.state?.micEnabled || false
  const initCam = location.state?.webcamEnabled || false

  // Render Provider
  return (
    <MeetingProvider
      config={{
        ...meetingConfig,
        apiKey: import.meta.env.VITE_VIDEOSDK_API_KEY,
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
        session={session}
        joinSession={joinSession}
        leaveSession={leaveSession}
        sessionError={sessionError}
        sdkReady={sdkReady}
        sdkToken={sdkToken}
      >
        {children}
      </VideoCallContent>
    </MeetingProvider>
  )
}
