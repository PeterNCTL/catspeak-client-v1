import React from "react"
import { useSearchParams } from "react-router-dom"
import { Checkbox, FormControlLabel } from "@mui/material"
import { useLanguage } from "@/shared/context/LanguageContext"
import FilterSection from "./FilterSection"

const LevelFilter = ({ currentLevels }) => {
  const { t } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()

  const handleLevelChange = (levelValue, isChecked) => {
    const newParams = new URLSearchParams(searchParams)
    const requiredLevelsParam = searchParams.get("requiredLevels")
    const currentLevelsArray = requiredLevelsParam
      ? requiredLevelsParam.split(",").map((s) => s.trim())
      : []

    let newLevels = [...currentLevelsArray]

    if (isChecked) {
      if (!newLevels.includes(levelValue)) {
        newLevels.push(levelValue)
      }
    } else {
      newLevels = newLevels.filter((l) => l !== levelValue)
    }

    // Set as comma-separated string or delete if empty
    if (newLevels.length > 0) {
      newParams.set("requiredLevels", newLevels.join(","))
    } else {
      newParams.delete("requiredLevels")
    }

    // Reset page to 1 when filter changes
    newParams.set("page", "1")
    setSearchParams(newParams, { preventScrollReset: true })
  }

  return (
    <FilterSection heading={t.rooms.filters.levelsHeading}>
      {currentLevels.map((levelObj) => {
        const requiredLevelsParam = searchParams.get("requiredLevels")
        const currentLevelsArray = requiredLevelsParam
          ? requiredLevelsParam.split(",").map((s) => s.trim())
          : []
        const isChecked = currentLevelsArray.includes(levelObj.value)

        return (
          <FormControlLabel
            key={levelObj.value}
            control={
              <Checkbox
                checked={isChecked}
                onChange={(e) =>
                  handleLevelChange(levelObj.value, e.target.checked)
                }
                sx={{
                  "&.Mui-checked": {
                    color: "#990011",
                  },
                }}
              />
            }
            label={levelObj.label}
          />
        )
      })}
    </FilterSection>
  )
}

export default LevelFilter
