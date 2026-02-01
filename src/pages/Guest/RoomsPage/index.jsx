import React from "react"
import { Tabs, ConfigProvider } from "antd"
import { FiMessageCircle, FiMonitor, FiUsers, FiLayers } from "react-icons/fi"
import { useSearchParams } from "react-router-dom"
import FiltersSidebar from "@/components/rooms/FiltersSidebar"
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
      <div className="mx-auto flex max-w-screen-xl flex-col gap-10 px-6 py-12 md:flex-row md:items-start">
        {/* Left column */}
        <div className="w-full md:w-1/2">
          <WelcomeSection
            allowConnect={allowConnect}
            setAllowConnect={setAllowConnect}
          />

          {/* Session Creation Buttons (Moved from WelcomeSection) */}
          <SessionActionButtons
            handleCreateOneOnOneSession={handleCreateOneOnOneSession}
            handleCreateStudyGroupSession={handleCreateStudyGroupSession}
            isCreatingOneOnOne={state.isCreatingOneOnOne}
            isCreatingStudyGroup={state.isCreatingStudyGroup}
          />
        </div>

        {/* Right column */}
        <div className="w-full md:w-1/2">
          <HeroCarousel slides={slides} />
        </div>
      </div>

      {/* Lower section with content & sidebar - SWAPPED to Sidebar Left */}
      <div className="mx-auto grid max-w-screen-xl gap-6 px-6 pb-12 md:grid-cols-[360px_1fr]">
        {/* Sidebar - NOW ON LEFT */}
        {tab === "class" ? <ClassSidebar /> : <FiltersSidebar />}

        {/* Content area - NOW ON RIGHT */}
        <div className="flex flex-col">
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#990011",
              },
            }}
          >
            <Tabs
              activeKey={tab}
              onChange={setTab}
              items={[
                {
                  key: "communicate",
                  label: (
                    <span className="flex items-center gap-2">
                      <FiMessageCircle className="h-4 w-4" />
                      {t.rooms.tabs.communicate}
                    </span>
                  ),
                  children: (
                    <CommunicateTab
                      rooms={rooms}
                      selectedCategories={categories}
                      page={page}
                      totalPages={totalPages}
                      setPage={setPage}
                      languageType={languageType}
                      requiredLevels={requiredLevelsArg}
                    />
                  ),
                },
                {
                  key: "teaching",
                  label: (
                    <span className="flex items-center gap-2">
                      <FiMonitor className="h-4 w-4" />
                      {t.rooms.tabs.teaching}
                    </span>
                  ),
                  children: <TeachingTab />,
                },
                {
                  key: "group",
                  label: (
                    <span className="flex items-center gap-2">
                      <FiUsers className="h-4 w-4" />
                      {t.rooms.tabs.group}
                    </span>
                  ),
                  children: <GroupTab />,
                },
                {
                  key: "class",
                  label: (
                    <span className="flex items-center gap-2">
                      <FiLayers className="h-4 w-4" />
                      {t.rooms.tabs.class}
                    </span>
                  ),
                  children: <ClassTab />,
                },
              ]}
            />
          </ConfigProvider>
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
