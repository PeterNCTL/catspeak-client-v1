import React, { useState } from "react"
import { Tabs, Tab, Box } from "@mui/material"
import {
  FiMessageCircle,
  FiMonitor,
  FiUsers,
  FiLayers,
  FiFilter,
} from "react-icons/fi"
import { Drawer } from "antd"
import { useSearchParams } from "react-router-dom"
import RoomFilterSidebar from "@/components/rooms/RoomFilterSidebar"
import ClassSidebar from "@/components/rooms/ClassSidebar"
import { useRoomsPageLogic } from "@/hooks/rooms/useRoomsPageLogic"
import WelcomeSection from "@/components/rooms/WelcomeSection"
import SessionActionButtons from "@/components/rooms/SessionActionButtons"
import HeroCarousel from "@/components/rooms/HeroCarousel"
import { useLanguage } from "@/context/LanguageContext"
import { useGetRoomsQuery } from "@/store/api/roomsApi"
import {
  CommunicateTab,
  TeachingTab,
  GroupTab,
  ClassTab,
} from "@/components/rooms/tabs"
import CreateRoomModal from "@/components/rooms/CreateRoomModal"
import { PageNotFound } from "@/pages/ErrorPage"

const RoomsPage = () => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const { t } = useLanguage()
  const { state, derived, actions } = useRoomsPageLogic()
  const { allowConnect, page, tab } = state
  const { slides } = derived
  const {
    setAllowConnect,
    setPage,
    setTab,
    handleCreateOneOnOneSession,
    handleCreateStudyGroupSession,
  } = actions

  // --- Extracting Data Fetching Logic ---
  const [searchParams] = useSearchParams()
  const languageParam = searchParams.get("language")
  const languageType = languageParam
    ? languageParam
        .split(",")
        .map((l) => l.trim().replace(/^\w/, (c) => c.toUpperCase()))
        .filter(Boolean)
    : undefined

  // Force 404 for Vietnamese language
  if (languageType?.includes("Vietnamese")) {
    return <PageNotFound />
  }

  const requiredLevelsParam = searchParams.get("requiredLevels")
  const requiredLevels = requiredLevelsParam
    ? requiredLevelsParam
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : []
  const requiredLevelsArg =
    requiredLevels.length > 0 ? requiredLevels : undefined
  const categoriesParam = searchParams.get("categories")
  const categories = categoriesParam
    ? categoriesParam.split(",").map((c) => c.trim())
    : undefined
  const pageSize = 12

  // Only fetch data in RoomsPage if we are in a specific category (Filtered View)
  // Otherwise, the CommunicateTab's sections will fetch their own data.
  const shouldFetch = !!categories

  const { data: responseData, isLoading } = useGetRoomsQuery(
    {
      page,
      pageSize,
      languageType,
      requiredLevels: requiredLevelsArg,
      categories,
    },
    { skip: !shouldFetch },
  )

  // Process data
  const rooms = responseData?.data ?? []
  const additionalData = responseData?.additionalData ?? {}
  const totalPages = additionalData.totalPages || 1
  // --------------------------------------

  return (
    <div className="w-full">
      {/* Hero Section - Improved mobile spacing */}
      <div className="mx-auto flex max-w-screen-xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8 md:gap-10 md:py-12 lg:flex-row lg:items-start">
        {/* Left column - Welcome Section */}
        <div className="w-full lg:w-1/2">
          <WelcomeSection
            allowConnect={allowConnect}
            setAllowConnect={setAllowConnect}
          />

          {/* Session Creation Buttons */}
          <SessionActionButtons
            handleCreateOneOnOneSession={handleCreateOneOnOneSession}
            handleCreateStudyGroupSession={handleCreateStudyGroupSession}
            isCreatingOneOnOne={state.isCreatingOneOnOne}
            isCreatingStudyGroup={state.isCreatingStudyGroup}
          />
        </div>

        {/* Right column - Hero Carousel */}
        <div className="w-full lg:w-1/2">
          <HeroCarousel slides={slides} />
        </div>
      </div>

      {/* Lower section with content & sidebar */}
      <div className="mx-auto max-w-screen-xl px-4 pb-6 sm:px-6 sm:pb-12">
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[300px_1fr] xl:grid-cols-[360px_1fr]">
          {/* Sidebar - Hidden on mobile by default, shown on tablet+ */}
          <div className="hidden lg:block">
            {tab === "class" ? <ClassSidebar /> : <RoomFilterSidebar />}
          </div>

          {/* Content area */}
          <div className="flex flex-col min-w-0">
            <Box sx={{ width: "100%" }}>
              <div className="flex items-start justify-between gap-2 overflow-hidden">
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Tabs
                    value={tab}
                    onChange={(event, newValue) => setTab(newValue)}
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                    aria-label="room tabs"
                    sx={{
                      "& .MuiTabs-indicator": {
                        backgroundColor: "#990011",
                      },
                      "& .MuiTab-root": {
                        color: "#666",
                        textTransform: "none",
                        minHeight: "48px",
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        "&.Mui-selected": {
                          color: "#990011",
                        },
                      },
                      "& .MuiTabs-scrollButtons": {
                        color: "#990011",
                        "&.Mui-disabled": {
                          opacity: 0.3,
                        },
                      },
                    }}
                  >
                    <Tab
                      value="communicate"
                      label={
                        <span className="flex items-center gap-1.5 sm:gap-2">
                          <FiMessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span className="text-xs sm:text-sm">
                            {t.rooms.tabs.communicate}
                          </span>
                        </span>
                      }
                    />
                    <Tab
                      value="teaching"
                      label={
                        <span className="flex items-center gap-1.5 sm:gap-2">
                          <FiMonitor className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span className="text-xs sm:text-sm">
                            {t.rooms.tabs.teaching}
                          </span>
                        </span>
                      }
                    />
                    <Tab
                      value="group"
                      label={
                        <span className="flex items-center gap-1.5 sm:gap-2">
                          <FiUsers className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span className="text-xs sm:text-sm">
                            {t.rooms.tabs.group}
                          </span>
                        </span>
                      }
                    />
                    <Tab
                      value="class"
                      label={
                        <span className="flex items-center gap-1.5 sm:gap-2">
                          <FiLayers className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <span className="text-xs sm:text-sm">
                            {t.rooms.tabs.class}
                          </span>
                        </span>
                      }
                    />
                  </Tabs>
                </Box>

                {/* Mobile Filter Button */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden mt-1.5 flex flex-shrink-0 items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-[#990011] transition-colors shadow-sm"
                >
                  <FiFilter className="h-3.5 w-3.5" />
                  <span>{t.rooms?.filters?.title || "Filters"}</span>
                </button>
              </div>

              {/* Mobile Sidebar Drawer */}
              <Drawer
                title={
                  tab === "class"
                    ? t.rooms?.tabs?.class || "Class List"
                    : t.rooms?.filters?.title || "Filters"
                }
                placement="right"
                onClose={() => setMobileFiltersOpen(false)}
                open={mobileFiltersOpen}
                styles={{
                  body: { padding: 0 },
                  wrapper: { width: 320 },
                }}
              >
                <div className="p-4">
                  {tab === "class" ? <ClassSidebar /> : <RoomFilterSidebar />}
                </div>
              </Drawer>

              {/* Tab Panels */}
              <Box sx={{ mt: 2 }}>
                {tab === "communicate" && (
                  <CommunicateTab
                    rooms={rooms}
                    selectedCategories={categories}
                    page={page}
                    totalPages={totalPages}
                    setPage={setPage}
                    languageType={languageType}
                    requiredLevels={requiredLevelsArg}
                  />
                )}
                {tab === "teaching" && <TeachingTab />}
                {tab === "group" && <GroupTab />}
                {tab === "class" && <ClassTab />}
              </Box>
            </Box>
          </div>
        </div>
      </div>
      <CreateRoomModal
        open={state.isCreateRoomModalOpen}
        onCancel={() => actions.setCreateRoomModalOpen(false)}
      />
    </div>
  )
}

export default RoomsPage
