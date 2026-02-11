import React from "react"
import { Typography } from "@mui/material"
import { useGetRoomsQuery } from "@/features/rooms/api/roomsApi"
import RoomCard from "./RoomCard"
import EmptyRoomState from "./EmptyRoomState"
import colors from "@/shared/utils/colors"
import { useLanguage } from "@/shared/context/LanguageContext"

const CategoryRoomSection = ({
  categoryKey,
  title,
  languageType,
  requiredLevels,
  onSeeMore,
}) => {
  const { t } = useLanguage()
  const pageSize = 4

  const { data: responseData, isLoading } = useGetRoomsQuery({
    page: 1,
    pageSize,
    languageType,
    requiredLevels,
    categories: [categoryKey],
  })

  const rooms = responseData?.data ?? []

  // Header section component
  const renderHeader = () => (
    <div className="flex h-8 items-center justify-between">
      <div className="flex items-end gap-3">
        <Typography
          variant="h6"
          sx={{
            mb: 0,
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: colors.headingColor,
          }}
        >
          {title}
        </Typography>
        <Typography
          component="button"
          variant="body2"
          onClick={() => onSeeMore(categoryKey)}
          sx={{
            mb: "2px",
            cursor: "pointer",
            border: 0,
            backgroundColor: "transparent",
            fontWeight: 500,
            color: "text.secondary",
            textDecoration: "none",
            "&:hover": {
              color: "text.primary",
            },
          }}
        >
          {t.rooms.filters.seeMore}
        </Typography>
      </div>
    </div>
  )

  if (!isLoading && rooms.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        {renderHeader()}
        <EmptyRoomState message={t.rooms.filters.noRoomsFoundCategory} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {renderHeader()}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="h-[300px] w-full animate-pulse rounded-2xl bg-gray-200"
              />
            ))
          : rooms.map((room) => <RoomCard key={room.roomId} room={room} />)}
      </div>
    </div>
  )
}

export default CategoryRoomSection
