import React from "react"
import { Pagination } from "antd"
import { useSearchParams } from "react-router-dom"
import { FiArrowLeft } from "react-icons/fi"
import RoomCard from "@/components/rooms/RoomCard"
import CategoryRoomSection from "@/components/rooms/CategoryRoomSection"
import EmptyRoomState from "@/components/rooms/EmptyRoomState"
import colors from "@/utils/colors"
import { useLanguage } from "@/context/LanguageContext"

const CommunicateTab = ({
  rooms = [], // Only used in Filtered View
  selectedCategories,
  page, // Global page (only for filtered view)
  totalPages, // Global totalPages (only for filtered view)
  setPage, // Global setPage (only for filtered view)
  languageType,
  requiredLevels,
}) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { t } = useLanguage()

  const handleCategoryClick = (categoryKey) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set("categories", categoryKey)
    newParams.set("page", 1) // Reset to page 1
    setSearchParams(newParams)

    // If setPage is provided (it should be in filtered view, but might be needed to reset parent state)
    if (setPage) setPage(1)
  }

  const handleBackToOverview = () => {
    const newParams = new URLSearchParams(searchParams)
    newParams.delete("categories")
    newParams.delete("page")
    setSearchParams(newParams)
    if (setPage) setPage(1)
  }

  const isFilteredView = selectedCategories && selectedCategories.length > 0

  // --- Filtered View (Single Category / Deep Dive) ---
  if (isFilteredView) {
    return (
      <div className="w-full flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex h-8 items-center gap-2 text-xl font-bold uppercase tracking-wide">
            <button
              onClick={handleBackToOverview}
              className="text-gray-400 hover:text-gray-900 transition-colors"
            >
              {t.rooms.filters.breadcrumb}
            </button>
            <span className="text-gray-400">&gt;</span>
            <span style={{ color: colors.headingColor }}>
              {selectedCategories
                .map((catKey) => t.rooms.filters.categories[catKey] || catKey)
                .join(", ")}
            </span>
          </div>

          {rooms.length > 0 && (
            <Pagination
              current={page}
              pageSize={1}
              total={totalPages}
              onChange={setPage}
              showSizeChanger={false}
            />
          )}
        </div>

        {rooms.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {rooms.map((room) => (
              <div key={room.roomId} className="w-full">
                <RoomCard room={room} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyRoomState message={t.rooms.filters.noRoomsFound} />
        )}
      </div>
    )
  }

  // --- Overview View (Independent Sections) ---

  // Define section configuration
  const sections = [
    {
      key: "practice",
      title: t.rooms.filters.categories.practice,
    },
    {
      key: "friends",
      title: t.rooms.filters.categories.friends,
    },
    {
      key: "trending",
      title: t.rooms.filters.categories.trending,
    },
    {
      key: "other",
      title: t.rooms.filters.categories.others,
    },
  ]

  return (
    <div className="w-full flex flex-col gap-10">
      {sections.map((section) => (
        <CategoryRoomSection
          key={section.key}
          categoryKey={section.key}
          title={section.title}
          languageType={languageType}
          requiredLevels={requiredLevels}
          onSeeMore={handleCategoryClick}
        />
      ))}
    </div>
  )
}

export default CommunicateTab
