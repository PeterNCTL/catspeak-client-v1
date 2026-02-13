import React from "react"
import { useSearchParams } from "react-router-dom"
import { Checkbox, FormControlLabel } from "@mui/material"
import { useLanguage } from "@/shared/context/LanguageContext"
import FilterSection from "./FilterSection"

const TOPIC_KEYS = [
  "family",
  "sports",
  "movies",
  "travel",
  "school",
  "stuff",
  "other",
]

const TopicFilter = () => {
  const { t } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()

  const handleTopicChange = (topicValue, isChecked) => {
    const newParams = new URLSearchParams(searchParams)
    const topicsParam = searchParams.get("topics")
    const currentTopicsArray = topicsParam
      ? topicsParam.split(",").map((s) => s.trim())
      : []

    let newTopics = [...currentTopicsArray]

    if (isChecked) {
      if (!newTopics.includes(topicValue)) {
        newTopics.push(topicValue)
      }
    } else {
      newTopics = newTopics.filter((t) => t !== topicValue)
    }

    // Set as comma-separated string or delete if empty
    if (newTopics.length > 0) {
      newParams.set("topics", newTopics.join(","))
    } else {
      newParams.delete("topics")
    }

    // Reset page to 1 when filter changes
    newParams.set("page", "1")
    setSearchParams(newParams, { preventScrollReset: true })
  }

  return (
    <FilterSection heading={t.rooms.filters.topicsHeading}>
      {TOPIC_KEYS.map((topicKey) => {
        const topicsParam = searchParams.get("topics")
        const currentTopicsArray = topicsParam
          ? topicsParam.split(",").map((s) => s.trim())
          : []
        const isChecked = currentTopicsArray.includes(topicKey)

        return (
          <FormControlLabel
            key={topicKey}
            control={
              <Checkbox
                checked={isChecked}
                onChange={(e) => handleTopicChange(topicKey, e.target.checked)}
                sx={{
                  "&.Mui-checked": {
                    color: "#990011",
                  },
                }}
              />
            }
            label={t.rooms.filters.topics[topicKey]}
          />
        )
      })}
    </FilterSection>
  )
}

export default TopicFilter
