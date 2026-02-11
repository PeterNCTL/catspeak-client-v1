import React, { useState } from "react"
import { useSearchParams } from "react-router-dom"
import {
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  IconButton,
  Typography,
  InputAdornment,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import { useLanguage } from "@/shared/context/LanguageContext"
import colors from "@/shared/utils/colors"

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

const RoomFilterSidebar = () => {
  const { t } = useLanguage()
  const filtersText = t.rooms.filters
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchValue, setSearchValue] = useState("")
  const currentLanguage =
    searchParams.get("language")?.toLowerCase() || "english"
  const currentLevels = LEVELS[currentLanguage] || LEVELS.english

  const handleSearch = () => {
    // Add search functionality here
    console.log("Search clicked:", searchValue)
  }

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
    <Box
      component="aside"
      className="rounded-[20px] bg-white shadow-sm overflow-hidden"
      sx={{
        border: 1,
        borderColor: "divider",
      }}
    >
      {/* Search Header */}
      <Box
        className="px-3 py-3 sm:px-4 sm:py-4"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder={filtersText.searchPlaceholder}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSearch()
            }
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "50px",
              fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
              fontWeight: 500,
              "&:hover": {
                backgroundColor: "grey.50",
              },
              "&.Mui-focused": {
                backgroundColor: "white",
              },
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleSearch}
                  size="small"
                  sx={{
                    color: "#990011",
                    "&:hover": {
                      backgroundColor: "rgba(153, 0, 17, 0.04)",
                    },
                  }}
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Filters Content - Only show for languages with levels */}
      {currentLevels && (
        <Box
          className="max-h-[400px] sm:max-h-[520px] overflow-y-auto px-4 py-4 sm:px-6 sm:py-6"
          sx={{
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "grey.200",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#990011",
              borderRadius: "3px",
            },
          }}
        >
          <Box className="space-y-2">
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "grey.800",
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              {filtersText.levelsHeading}
            </Typography>

            <Box className="flex flex-col">
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
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default RoomFilterSidebar
