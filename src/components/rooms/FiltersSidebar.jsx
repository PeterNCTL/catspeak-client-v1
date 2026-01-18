import React from "react"
import { FiSearch } from "react-icons/fi"
import { useSearchParams } from "react-router-dom"
import { useLanguage } from "@/context/LanguageContext"
import { Input, Checkbox, ConfigProvider, theme } from "antd"
import colors from "@/utils/colors"

const LEVELS = {
  english: ["A1", "A2", "B1", "B2", "C1", "C2"],
  chinese: ["HSK 1", "HSK 2", "HSK 3", "HSK 4", "HSK 5", "HSK 6"],
}

const FiltersSidebar = () => {
  const { t } = useLanguage()
  const filtersText = t.rooms.filters
  const [searchParams] = useSearchParams()
  const currentLanguage = searchParams.get("language") || "english"
  const currentLevels = LEVELS[currentLanguage]

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
        className="rounded-3xl border bg-white shadow-sm overflow-hidden"
        style={{ borderColor: colors.border }}
      >
        {/* Search Header */}
        <div
          className="border-b px-4 py-4"
          style={{ borderColor: colors.border }}
        >
          <Input
            placeholder={filtersText.searchPlaceholder}
            className="rounded-full px-4 py-2 hover:bg-gray-50 focus:bg-white border transition-all text-sm md:text-base"
            style={{
              borderColor: colors.border,
            }}
            styles={{
              input: { fontWeight: 500 },
            }}
            suffix={
              <button
                type="button"
                className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-red-50 transition-colors"
                onClick={() => {
                  // Add search functionality here
                  console.log("Search clicked")
                }}
              >
                <FiSearch className="text-[#990011] text-lg" />
              </button>
            }
          />
        </div>

        {/* Filters Content - Only show for languages with levels */}
        {currentLevels && (
          <div className="max-h-[520px] overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-thumb-[#990011] scrollbar-track-gray-200">
            <div className="space-y-4">
              <h3 className="text-base font-bold text-gray-800 uppercase tracking-wide">
                {filtersText.levelsHeading}
              </h3>

              <div className="flex flex-col gap-3">
                {currentLevels.map((level) => (
                  <Checkbox
                    key={level}
                    className="text-gray-600 font-medium hover:text-[#990011] transition-colors"
                  >
                    {level}
                  </Checkbox>
                ))}
              </div>
            </div>
          </div>
        )}
      </aside>
    </ConfigProvider>
  )
}

export default FiltersSidebar
