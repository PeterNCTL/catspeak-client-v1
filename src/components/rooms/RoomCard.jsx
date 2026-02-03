import React from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Typography, Box } from "@mui/material"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import PeopleIcon from "@mui/icons-material/People"
import LinkIcon from "@mui/icons-material/Link"
import BookmarkIcon from "@mui/icons-material/Bookmark"
import colors from "@/utils/colors"
import { useLanguage } from "@context/LanguageContext"
import {
  formatDate,
  formatTimeRange,
  calculateEndDate,
} from "@/utils/dateFormatter"
import InDevelopmentModal from "@/components/common/InDevelopmentModal"

const RoomCard = ({ room }) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { language } = useLanguage()

  const handleJoinRoom = (e) => {
    e.stopPropagation()

    // Update searchParams with the current language
    const newSearchParams = new URLSearchParams(searchParams)

    navigate({
      pathname: `/room/${room.roomId}`,
      search: newSearchParams.toString(),
    })
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
      <Box
        onClick={handleJoinRoom}
        className="group relative flex w-full flex-col overflow-hidden rounded-[20px] bg-white shadow-sm transition-all duration-300 hover:shadow-xl cursor-pointer"
        sx={{
          fontFamily: "'Inter', sans-serif",
          border: 1,
          borderColor: "divider",
        }}
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

          <div className="absolute right-4 -top-1">
            <div
              onClick={handleBookmarkClick}
              className="cursor-pointer transition-transform duration-200 origin-top hover:scale-y-125 active:scale-y-95"
            >
              <BookmarkIcon
                sx={{
                  fontSize: 32,
                  color: "#990011",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                }}
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col p-5">
          {/* Title */}
          <Typography
            variant="h6"
            className="mb-2 font-bold text-gray-900 line-clamp-1"
          >
            {room.name}
          </Typography>

          {/* Room Link/Code */}
          <div className="mb-4 flex items-center gap-2">
            <LinkIcon sx={{ fontSize: 20, color: "#eab308" }} />
            <span className="h-4 w-[1px] bg-gray-300"></span>
            <Typography variant="body2" className="font-medium text-yellow-500">
              {roomCode}
            </Typography>
          </div>

          {/* Divider */}
          <Box
            sx={{
              height: "1px",
              width: "100%",
              backgroundColor: "divider",
              mb: 2,
            }}
          />

          {/* Footer Info */}
          <div className="flex items-center justify-between">
            {/* Participants */}
            <div className="flex items-center gap-3">
              <Box
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
                sx={{ border: 1, borderColor: "divider" }}
              >
                <PeopleIcon sx={{ color: "#990011" }} />
              </Box>
              <Typography variant="body1" fontWeight="bold">
                {room.currentParticipantCount || 0}/{room.maxParticipants}
              </Typography>
            </div>

            {/* Date/Time */}
            <div className="flex items-center gap-3">
              <Box
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
                sx={{ border: 1, borderColor: "divider" }}
              >
                <AccessTimeIcon sx={{ color: "#990011" }} />
              </Box>
              <div className="flex flex-col text-left">
                <Typography variant="body2" fontWeight="bold">
                  {dateStr}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {timeStr}
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </Box>

      <InDevelopmentModal
        open={showDevModal}
        onCancel={() => setShowDevModal(false)}
      />
    </>
  )
}

export default RoomCard
