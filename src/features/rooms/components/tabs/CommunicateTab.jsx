import React from "react"
import { Pagination } from "antd"
import { useSearchParams } from "react-router-dom"
import { FiArrowLeft } from "react-icons/fi"
import RoomCard from "../RoomCard"
import CategoryRoomSection from "../CategoryRoomSection"
import EmptyRoomState from "../EmptyRoomState"
import colors from "@/shared/utils/colors"
import { useLanguage } from "@/shared/context/LanguageContext"
import { AnimatePresence } from "framer-motion"
import { FadeAnimation } from "@/shared/animations"

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
    setSearchParams(newParams, { preventScrollReset: true })

    // If setPage is provided (it should be in filtered view, but might be needed to reset parent state)
    if (setPage) setPage(1)
  }

  const handleBackToOverview = () => {
    const newParams = new URLSearchParams(searchParams)
    newParams.delete("categories")
    newParams.delete("page")
    setSearchParams(newParams, { preventScrollReset: true })
    if (setPage) setPage(1)
  }

  const isFilteredView = selectedCategories && selectedCategories.length > 0

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
    <div className="w-full relative overflow-hidden">
      <AnimatePresence mode="wait">
        <FadeAnimation
          key={isFilteredView ? "filtered" : "overview"}
          className="w-full"
        >
          {isFilteredView ? (
            <div className="w-full flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xl font-bold">
                  <button
                    onClick={handleBackToOverview}
                    className="text-[#7A7574] hover:text-black transition-colors"
                  >
                    {t.rooms.filters.breadcrumb}
                  </button>
                  <span className="text-[#7A7574]">&gt;</span>
                  <span style={{ color: colors.headingColor }}>
                    {selectedCategories
                      .map(
                        (catKey) =>
                          t.rooms.filters.categories[catKey] || catKey,
                      )
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
          ) : (
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
          )}
        </FadeAnimation>
      </AnimatePresence>
    </div>
  )
}

export default CommunicateTab
