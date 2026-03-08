import React from "react"
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
        <h6
          className="mb-0 text-xl font-bold"
          style={{ color: colors.headingColor }}
        >
          {title}
        </h6>
        <button
          onClick={() => onSeeMore(categoryKey)}
          className="mb-[2px] cursor-pointer text-sm text-[#7A7574] no-underline hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          {t.rooms.filters.seeMore}
        </button>
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
