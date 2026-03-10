import React from "react"
import { useSearchParams } from "react-router-dom"
import { Clock, Users, Link, Bookmark } from "lucide-react"
import { useLanguage } from "@/shared/context/LanguageContext"
import {
  formatDate,
  formatTimeRange,
  calculateEndDate,
} from "@/shared/utils/dateFormatter"
import InDevelopmentModal from "@/shared/components/common/InDevelopmentModal"

const RoomCard = ({ room }) => {
  const [searchParams] = useSearchParams()
  const { language } = useLanguage()

  const handleJoinRoom = (e) => {
    e.stopPropagation()

    // Update searchParams with the current language
    const url = `/room/${room.roomId}`

    window.open(url, "_blank")
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

  const [showDevModal, setShowDevModal] = React.useState(false)

  const handleBookmarkClick = (e) => {
    e.stopPropagation()
    setShowDevModal(true)
  }

  return (
    <>
      <div
        onClick={handleJoinRoom}
        style={{ fontFamily: "'Inter', sans-serif" }}
        className="group relative flex w-full flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-xl cursor-pointer border border-[#C6C6C6]"
      >
        {/* Cover Image Section */}
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
            alt="Room Cover"
            className="h-full w-full object-cover transition-transform duration-500"
          />

          {/* Top Overlay: Tags & Bookmark */}
          <div className="absolute left-4 top-4 flex gap-2">
            {room.requiredLevel && (
              <span className="rounded-full bg-[#990011] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                {room.requiredLevel}
              </span>
            )}
          </div>

          <div
            className="absolute right-2 top-2 z-20 transition-all duration-300"
            onClick={handleBookmarkClick}
          >
            <Bookmark
              className="drop-shadow-md transition-all duration-200 text-white hover:text-gray-200"
              size={32}
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col p-5">
          {/* Title */}
          <h3 className="mb-2 text-lg font-bold text-gray-900 line-clamp-1">
            {room.name}
          </h3>

          {/* Room Link/Code */}
          <div className="mb-4 flex items-center gap-2">
            <Link className="h-5 w-5 text-yellow-500" />
            <span className="h-4 w-[1px] bg-gray-300"></span>
            <span className="text-sm font-medium text-yellow-500">
              {roomCode}
            </span>
          </div>

          {/* Divider */}
          <div className="mb-4 h-px w-full bg-gray-200" />

          {/* Footer Info */}
          <div className="flex items-center justify-between">
            {/* Participants */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm border border-gray-200">
                <Users className="h-5 w-5 text-[#990011]" />
              </div>
              <span className="text-base font-bold">
                {room.currentParticipantCount || 0}/{room.maxParticipants}
              </span>
            </div>

            {/* Date/Time */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm border border-gray-200">
                <Clock className="h-5 w-5 text-[#990011]" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold">{dateStr}</span>
                <span className="text-xs text-gray-500">{timeStr}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <InDevelopmentModal
        open={showDevModal}
        onCancel={() => setShowDevModal(false)}
      />
    </>
  )
}

export default RoomCard
