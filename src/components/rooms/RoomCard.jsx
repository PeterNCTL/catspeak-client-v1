import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FiClock, FiUsers, FiLink } from "react-icons/fi"
import { FaBookmark } from "react-icons/fa"
import { Spin } from "antd" // Import Spin for loading state
import colors from "@/utils/colors"
import {
  useGetActiveVideoSessionsQuery,
  useJoinVideoSessionMutation,
  useCreateVideoSessionMutation,
} from "@/store/api/videoSessionsApi"
import {
  formatDate,
  formatTimeRange,
  calculateEndDate,
} from "@/utils/dateFormatter"

const RoomCard = ({ room }) => {
  const navigate = useNavigate()

  // API Hooks
  const { data: activeSessions, refetch: refetchActiveSessions } =
    useGetActiveVideoSessionsQuery()
  const [joinVideoSession, { isLoading: isJoining }] =
    useJoinVideoSessionMutation()
  const [createVideoSession, { isLoading: isCreating }] =
    useCreateVideoSessionMutation()

  const isLoading = isJoining || isCreating

  const handleJoinRoom = async (e) => {
    e.stopPropagation()
    if (isLoading) return

    try {
      const roomId = room.roomId
      const activeSession = activeSessions?.find(
        (s) => s.roomId === parseInt(roomId),
      )
      let sessionId

      if (activeSession) {
        // Session exists → join existing session
        sessionId = activeSession.sessionId
        try {
          await joinVideoSession(sessionId).unwrap()
        } catch (err) {
          console.warn(
            "Join session API failed or already in session. Proceeding...",
            err,
          )
        }
      } else {
        // No session → create new session
        try {
          const newSession = await createVideoSession({
            roomId: parseInt(roomId),
          }).unwrap()
          sessionId = newSession.sessionId
        } catch (err) {
          console.warn(
            "Create session failed, checking for active session...",
            err,
          )
          // Retry logic
          const { data: refreshedSessions } = await refetchActiveSessions()
          const retrySession = refreshedSessions?.find(
            (s) => s.roomId === parseInt(roomId),
          )

          if (retrySession) {
            sessionId = retrySession.sessionId
            await joinVideoSession(sessionId).unwrap()
          } else {
            console.error("Failed to create or join session:", err)
            // You might want to use message.error only if context allows or just verify silently
            return
          }
        }
      }

      navigate(`/meet/${sessionId}`)
    } catch (err) {
      console.error("Failed to join/create session:", err)
    }
  }

  // Date and time formatting using locale-aware utilities
  const createDate = new Date(room.createDate)
  const dateStr = formatDate(createDate)

  // Use duration from the room response (in minutes)
  const durationMinutes = room.duration || 20 // fallback to 20 if not provided
  const endDate = calculateEndDate(createDate, durationMinutes)

  const timeStr = formatTimeRange(createDate, endDate)

  // Placeholder code simulation
  const roomCode = `room-${room.roomId}`.toLowerCase()

  return (
    <div
      onClick={handleJoinRoom}
      className={`group relative flex w-full flex-col overflow-hidden rounded-[32px] border bg-white shadow-sm transition-all duration-300 hover:shadow-xl ${
        isLoading ? "cursor-wait opacity-70" : "cursor-pointer"
      }`}
      style={{
        fontFamily: "'Inter', sans-serif",
        borderColor: colors.border,
      }}
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50">
          <Spin />
        </div>
      )}

      {/* Cover Image Section */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
          alt="Room Cover"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Top Overlay: Tags & Bookmark */}
        <div className="absolute left-4 top-4 flex gap-2">
          {room.requiredLevel && (
            <span className="rounded-full bg-[#990011] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              {room.requiredLevel}
            </span>
          )}
        </div>

        <div className="absolute right-4 top-0">
          <div className="relative">
            <FaBookmark className="h-8 w-6 text-[#990011] drop-shadow-md" />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-5">
        {/* Title */}
        <h3 className="mb-2 text-xl font-bold text-gray-900 line-clamp-1">
          {room.name}
        </h3>

        {/* Room Link/Code */}
        <div className="mb-4 flex items-center gap-2">
          <FiLink className="text-xl text-yellow-500" />
          <span className="h-4 w-[1px] bg-gray-300"></span>
          <span className="text-sm font-medium text-yellow-500">
            {roomCode}
          </span>
        </div>

        {/* Divider */}
        <div className="mb-4 h-px w-full bg-gray-100"></div>

        {/* Footer Info */}
        <div className="flex items-center justify-between">
          {/* Participants */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-red-100 bg-white shadow-sm">
              <FiUsers className="text-lg text-[#990011]" />
            </div>
            <span className="text-lg font-bold text-gray-600">
              {room.currentParticipantCount || 0}/{room.maxParticipants}
            </span>
          </div>

          {/* Date/Time */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-red-100 bg-white shadow-sm">
              <FiClock className="text-lg text-[#990011]" />
            </div>
            <div className="flex flex-col text-right">
              <span className="text-xs font-bold text-gray-600">{dateStr}</span>
              <span className="text-[10px] font-medium text-gray-400">
                {timeStr}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomCard
