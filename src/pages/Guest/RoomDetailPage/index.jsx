import React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useGetRoomByIdQuery } from "@/store/api/roomsApi"
import {
  useGetActiveVideoSessionsQuery,
  useJoinVideoSessionMutation,
  useCreateVideoSessionMutation,
} from "@/store/api/videoSessionsApi"
import LiquidGlassButton from "@components/LiquidGlassButton"
import {
  FiCalendar,
  FiClock,
  FiUsers,
  FiShare2,
  FiMonitor,
} from "react-icons/fi"

const RoomDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
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

  if (isLoadingRoom || isLoadingSessions)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    )

  if (error || !room)
    return (
      <div className="flex h-screen items-center justify-center">
        Room not found
      </div>
    )

  const createDate = new Date(room.createDate)
  const dateStr = createDate.toLocaleDateString("vi-VN")
  const timeStr = createDate.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  })

  const handleJoinRoom = async () => {
    try {
      let sessionId

      if (activeSession) {
        // Session exists → join existing session
        sessionId = activeSession.sessionId
        try {
          await joinVideoSession(sessionId).unwrap()
        } catch (err) {
          console.warn(
            "Join session API failed (user might already be in session). Proceeding to room.",
            err
          )
        }
      } else {
        // No session → create new session for this persistent room
        try {
          const newSession = await createVideoSession({
            roomId: parseInt(id),
          }).unwrap()
          sessionId = newSession.sessionId
        } catch (err) {
          // Handle race condition: another user might have created session simultaneously
          console.warn("Create session failed, checking for active session...", err)

          // Retry: refetch active sessions and try to join
          const { data: refreshedSessions } = await refetchActiveSessions()
          const retrySession = refreshedSessions?.find((s) => s.roomId === parseInt(id))

          if (retrySession) {
            sessionId = retrySession.sessionId
            await joinVideoSession(sessionId).unwrap()
          } else {
            // If still no session, show error
            console.error("Failed to create or join session:", err)
            alert("Không thể tham gia phòng. Vui lòng thử lại.")
            return
          }
        }
      }

      // Navigate to video call room
      navigate(`/meet/${sessionId}`)
    } catch (err) {
      console.error("Failed to join/create session:", err)
      alert("Đã xảy ra lỗi. Vui lòng thử lại.")
    }
  }

  const image =
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"

  return (
    <div className="mx-auto max-w-screen-xl px-6 py-12">
      <div className="grid gap-12 md:grid-cols-[2fr_1fr]">
        {/* Left Column: Image & Description */}
        <div>
          <div className="relative overflow-hidden rounded-[32px] shadow-lg">
            <img
              src={image}
              alt={room.name}
              className="aspect-video w-full object-cover"
            />
            <div
              className={`absolute left-6 top-6 rounded-full px-4 py-1 text-sm font-bold uppercase text-white shadow ${room.status === 1 ? "bg-[#990011]" : "bg-gray-500"
                }`}
            >
              {room.status === 1 ? "Đang diễn ra" : "Đã kết thúc"}
            </div>
          </div>

          <h1 className="mt-8 text-4xl font-black text-[#990011]">
            {room.name}
          </h1>

          <div className="mt-6 space-y-4 text-gray-700 leading-relaxed">
            <p>
              Tham gia phòng học này để luyện tập kỹ năng Speaking của bạn. Hãy
              chuẩn bị microphone và camera để có trải nghiệm tốt nhất.
            </p>
            {/* Add more description or details if available in the API response */}
          </div>
        </div>

        {/* Right Column: Info Card */}
        <div className="h-fit rounded-[32px] bg-white p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100">
          <h3 className="mb-6 text-xl font-bold text-gray-900">
            Thông tin phòng
          </h3>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fdf2f2] text-[#990011]">
                <FiCalendar className="text-xl" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Ngày tạo</p>
                <p className="font-bold text-gray-900">{dateStr}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fdf2f2] text-[#990011]">
                <FiClock className="text-xl" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Thời gian</p>
                <p className="font-bold text-gray-900">{timeStr}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fdf2f2] text-[#990011]">
                <FiUsers className="text-xl" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Người tạo</p>
                <p className="font-bold text-gray-900">
                  User #{room.creatorId}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fdf2f2] text-[#990011]">
                <FiMonitor className="text-xl" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Mã phòng</p>
                <p className="font-bold text-gray-900">{room.roomId}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <LiquidGlassButton
              type="button"
              variant="gradient"
              className="w-full rounded-2xl py-4 text-lg font-bold uppercase tracking-wide text-white disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleJoinRoom}
              disabled={isJoining || isCreating}
            >
              {isJoining
                ? "Đang tham gia..."
                : isCreating
                  ? "Đang tạo phòng..."
                  : "Tham gia ngay"}
            </LiquidGlassButton>

            <button
              onClick={() => {
                const url = `${window.location.origin}/meet/${id}`
                navigator.clipboard.writeText(url)
                alert("Link copied to clipboard!")
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-gray-200 py-3 font-bold text-gray-600 transition hover:border-gray-300 hover:bg-gray-50"
            >
              <FiShare2 />
              Chia sẻ
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomDetailPage
