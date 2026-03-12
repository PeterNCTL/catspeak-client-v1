import React from "react"
import { useGetRoomsQuery } from "@/store/api/roomsApi"
import RoomCard from "../RoomCard"
import EmptyRoomState from "../EmptyRoomState"
import colors from "@/shared/utils/colors"
import { useLanguage } from "@/shared/context/LanguageContext"
import { ChevronRight } from "lucide-react"

const CategoryRoomSection = ({
  categoryKey,
  title,
  languageType,
  requiredLevels,
  topics,
  onSeeMore,
}) => {
  const { t } = useLanguage()
  const pageSize = 4

  const { data: responseData, isLoading } = useGetRoomsQuery({
    page: 1,
    pageSize,
    languageType,
    requiredLevels,
    topics,
    categories: [categoryKey],
  })

  const rooms = responseData?.data ?? []

  // Header section component
  const renderHeader = () => (
    <button
      onClick={() => onSeeMore(categoryKey)}
      className="group w-fit flex h-12 items-center gap-2 rounded-md hover:bg-[#E5E5E5] pr-6"
    >
      <div className="flex items-center gap-2 transition-transform duration-300 group-hover:translate-x-4">
        <h6
          className="mb-0 text-xl font-bold"
          style={{ color: colors.headingColor }}
        >
          {title}
        </h6>

        <ChevronRight size={24} color="#990011" />
      </div>
    </button>
  )

  if (!isLoading && rooms.length === 0) {
    return (
      <div className="flex flex-col gap-2">
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
