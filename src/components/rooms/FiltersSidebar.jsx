import React from "react"
import { FiSearch } from "react-icons/fi"
import { useSearchParams } from "react-router-dom"
import { useLanguage } from "@/context/LanguageContext"
import { Input, Checkbox, ConfigProvider, theme } from "antd"
import colors from "@/utils/colors"

const LEVELS = {
  english: [
    { label: "A1", value: "A1" },
    { label: "A2", value: "A2" },
    { label: "B1", value: "B1" },
    { label: "B2", value: "B2" },
    { label: "C1", value: "C1" },
    { label: "C2", value: "C2" },
  ],
  vietnamese: [
    { label: "Beginner", value: "Beginner" },
    { label: "Intermediate", value: "Intermediate" },
    { label: "Advanced", value: "Advanced" },
  ],
  chinese: [
    { label: "HSK 1", value: "HSK1" },
    { label: "HSK 2", value: "HSK2" },
    { label: "HSK 3", value: "HSK3" },
    { label: "HSK 4", value: "HSK4" },
    { label: "HSK 5", value: "HSK5" },
    { label: "HSK 6", value: "HSK6" },
  ],
}

const FiltersSidebar = () => {
  const { t } = useLanguage()
  const filtersText = t.rooms.filters
  const [searchParams, setSearchParams] = useSearchParams()
  const currentLanguage =
    searchParams.get("language")?.toLowerCase() || "english"
  const currentLevels = LEVELS[currentLanguage] || LEVELS.english

  // Use Ant Design theme token for consistent colors
  const { token } = theme.useToken()

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#990011", // Brand red color
        },
      }}
    >
      <aside
        className="rounded-2xl sm:rounded-3xl border bg-white shadow-sm overflow-hidden"
        style={{ borderColor: colors.border }}
      >
        {/* Search Header */}
        <div
          className="border-b px-3 py-3 sm:px-4 sm:py-4"
          style={{ borderColor: colors.border }}
        >
          <Input
            placeholder={filtersText.searchPlaceholder}
            className="rounded-full px-3 py-1.5 sm:px-4 sm:py-2 hover:bg-gray-50 focus:bg-white border transition-all text-xs sm:text-sm md:text-base"
            style={{
              borderColor: colors.border,
            }}
            styles={{
              input: { fontWeight: 500 },
            }}
            suffix={
              <button
                type="button"
                className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-md hover:bg-red-50 transition-colors"
                onClick={() => {
                  // Add search functionality here
                  console.log("Search clicked")
                }}
              >
                <FiSearch className="text-[#990011] text-base sm:text-lg" />
              </button>
            }
          />
        </div>

        {/* Filters Content - Only show for languages with levels */}
        {currentLevels && (
          <div className="max-h-[400px] sm:max-h-[520px] overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 scrollbar-thin scrollbar-thumb-[#990011] scrollbar-track-gray-200">
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-sm sm:text-base font-bold text-gray-800 uppercase tracking-wide">
                {filtersText.levelsHeading}
              </h3>

              <div className="flex flex-col gap-3">
                {currentLevels.map((levelObj) => {
                  const requiredLevelsParam = searchParams.get("requiredLevels")
                  const currentLevelsArray = requiredLevelsParam
                    ? requiredLevelsParam.split(",").map((s) => s.trim())
                    : []
                  const isChecked = currentLevelsArray.includes(levelObj.value)
                  return (
                    <Checkbox
                      key={levelObj.value}
                      checked={isChecked}
                      onChange={(e) => {
                        const newParams = new URLSearchParams(searchParams)

                        let newLevels = [...currentLevelsArray]

                        if (e.target.checked) {
                          if (!newLevels.includes(levelObj.value)) {
                            newLevels.push(levelObj.value)
                          }
                        } else {
                          newLevels = newLevels.filter(
                            (l) => l !== levelObj.value,
                          )
                        }

                        // Set as comma-separated string or delete if empty
                        if (newLevels.length > 0) {
                          newParams.set("requiredLevels", newLevels.join(","))
                        } else {
                          newParams.delete("requiredLevels")
                        }

                        // Reset page to 1 when filter changes
                        newParams.set("page", "1")
                        setSearchParams(newParams)
                      }}
                      className="text-gray-600 font-medium hover:text-[#990011] transition-colors"
                    >
                      {levelObj.label}
                    </Checkbox>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </aside>
    </ConfigProvider>
  )
}

export default FiltersSidebar
