import React, { useState } from "react"
import { MessageCircle, Monitor, Users, Layers, Filter } from "lucide-react"
import { useSearchParams, useParams } from "react-router-dom"
import {
  RoomFilterSidebar,
  ClassSidebar,
  WelcomeSection,
  SessionActionButtons,
  HeroCarousel,
  CommunicateTab,
  TeachingTab,
  GroupTab,
  ClassTab,
  CreateRoomModal,
  RoomsTabs,
  RoomsMobileDrawer,
  useRoomsPageLogic,
  useGetRoomsQuery,
} from "@/features/rooms"
import { useLanguage } from "@/shared/context/LanguageContext"
import { PageNotFound } from "@/shared/pages"
import { AnimatePresence } from "framer-motion"
import { FadeAnimation, FluentAnimation } from "@/shared/animations"

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
  const { lang } = useParams()

  // Map language code to language type
  const langMap = {
    en: "English",
    zh: "Chinese",
    vi: "Vietnamese",
  }
  const languageType = lang ? [langMap[lang]] : undefined

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
    <AnimatePresence mode="wait">
      <FluentAnimation
        animationKey="rooms-page"
        direction="up"
        className="w-full"
      >
        {/* Hero Section - Improved mobile spacing */}
        <div className="flex flex-col gap-5 p-5 sm:px-6 sm:py-8 md:gap-10 md:py-12 lg:flex-row lg:items-start">
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
        <div className="px-5 sm:px-6 sm:pb-12">
          <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[320px_1fr]">
            {/* Sidebar - Hidden on mobile by default, shown on tablet+ */}
            <div className="hidden lg:block">
              {tab === "class" ? <ClassSidebar /> : <RoomFilterSidebar />}
            </div>

            {/* Content area */}
            <div className="flex flex-col min-w-0">
              <div className="w-full">
                <div className="flex items-start justify-between gap-2 overflow-hidden">
                  <div className="flex-1 min-w-0">
                    <RoomsTabs tab={tab} setTab={setTab} />
                  </div>

                  {/* Mobile Filter Button */}
                  <button
                    onClick={() => setMobileFiltersOpen(true)}
                    className="lg:hidden flex items-center gap-3 rounded-full bg-white h-12 px-4 text-base font-medium hover:bg-[#E5E5E5]"
                  >
                    <Filter />
                    <span>{t.rooms?.filters?.title || "Filters"}</span>
                  </button>
                </div>

                {/* Mobile Sidebar Drawer */}
                <RoomsMobileDrawer
                  isOpen={mobileFiltersOpen}
                  onClose={() => setMobileFiltersOpen(false)}
                  title={
                    tab === "class"
                      ? t.rooms?.tabs?.class || "Class List"
                      : t.rooms?.filters?.title || "Filters"
                  }
                >
                  {tab === "class" ? <ClassSidebar /> : <RoomFilterSidebar />}
                </RoomsMobileDrawer>

                {/* Tab Panels */}
                <div className="mt-4 sm:mt-6 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <FadeAnimation key={tab} className="w-full">
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
                    </FadeAnimation>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
        <CreateRoomModal
          open={state.isCreateRoomModalOpen}
          onCancel={() => actions.setCreateRoomModalOpen(false)}
        />
      </FluentAnimation>
    </AnimatePresence>
  )
}

export default RoomsPage
