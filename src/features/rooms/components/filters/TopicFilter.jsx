import React from "react"
import { useLanguage } from "@/shared/context/LanguageContext"
import { useSearchParams } from "react-router-dom"
import { TOPICS } from "../../config/constants"

const TopicFilter = () => {
  const { t } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()
  const currentTopic = searchParams.get("topic")

  const handleTopicChange = (topic) => {
    const newParams = new URLSearchParams(searchParams)
    if (currentTopic === topic) {
      newParams.delete("topic")
    } else {
      newParams.set("topic", topic)
    }
    newParams.set("page", "1")
    setSearchParams(newParams, { preventScrollReset: true })
  }

  return (
    <div>
      <h3 className="font-bold text-lg mb-2">
        {t.rooms.filters.topicsHeading}
      </h3>

      <div className="flex flex-col">
        {TOPICS.map((topic) => {
          const isChecked = currentTopic === topic

          return (
            <label
              key={topic}
              className={`h-11 flex items-center gap-3 cursor-pointer rounded-md px-4 transition-colors ${
                isChecked
                  ? "bg-[#F2F2F2] hover:bg-[#E5E5E5]"
                  : "hover:bg-[#F2F2F2]"
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleTopicChange(topic)}
                className="w-4 h-4 text-[#990011] bg-white accent-[#990011] cursor-pointer"
              />
              <span className="text-base">{topic}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

export default TopicFilter
