import React from "react"
import { useGetRoomsQuery } from "@/store/api/roomsApi"
import RoomCard from "@/components/rooms/RoomCard"
import colors from "@/utils/colors"
import { useLanguage } from "@/context/LanguageContext"

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

  // Process data
  const rooms = responseData?.data ?? []
  const additionalData = responseData?.additionalData ?? {}

  if (!isLoading && rooms.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex h-8 items-center justify-between">
          <h3
            className="text-xl font-bold uppercase tracking-wide"
            style={{ color: colors.headingColor }}
          >
            {title}
          </h3>
          <button
            onClick={() => onSeeMore(categoryKey)}
            className="text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            {t.rooms.filters.seeMore}
          </button>
        </div>
        <div className="flex h-32 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 text-gray-400">
          <p>No rooms found in this category</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-8 items-center justify-between">
        <div className="flex items-end gap-3">
          <h3
            className="mb-0 text-xl font-bold uppercase tracking-wide"
            style={{ color: colors.headingColor }}
          >
            {title}
          </h3>
          <button
            onClick={() => onSeeMore(categoryKey)}
            className="text-sm font-medium text-gray-500 hover:text-gray-900 mb-[2px]"
          >
            {t.rooms.filters.seeMore}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="h-[300px] w-full animate-pulse rounded-2xl bg-gray-200"
              ></div>
            ))
          : rooms.map((room) => (
              <div key={room.roomId} className="w-full">
                <RoomCard room={room} />
              </div>
            ))}
      </div>
    </div>
  )
}

export default CategoryRoomSection
