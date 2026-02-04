import React, { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { MeetingProvider } from "@videosdk.live/react-sdk"

import { useGetProfileQuery } from "@/store/api/authApi"
import {
  useGetVideoSessionByIdQuery,
  useLeaveVideoSessionMutation,
  useJoinVideoSessionMutation,
  useGetVideoSdkTokenMutation,
} from "@/store/api/videoSessionsApi"
import { meetingConfig } from "@/utils/videoSdkConfig"

import { VideoCallContent } from "./VideoCallContext"

export const VideoCallProvider = ({ children }) => {
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
        <p>Loading Session...</p>
      </div>
    )
  }

  // Handle errors or missing session
  if (sessionError || (!isLoadingSession && !session)) {
    console.error("Failed to load session:", sessionError)
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-950 text-white flex-col gap-4">
        <p className="text-red-500 text-xl">Failed to load session</p>
        <p className="text-gray-400 text-sm">
          {sessionError?.data?.message || "Unknown error occurred"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-neutral-800 rounded hover:bg-neutral-700 transition"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!sdkReady) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-950 text-white">
        <p>Connecting to meeting…</p>
      </div>
    )
  }

  // Render Provider
  return (
    <MeetingProvider
      config={{
        ...meetingConfig,
        apiKey: import.meta.env.VITE_VIDEOSDK_API_KEY,
        meetingId: session.videoSdkMeetingId,
        micEnabled: true,
        webcamEnabled: true,
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


