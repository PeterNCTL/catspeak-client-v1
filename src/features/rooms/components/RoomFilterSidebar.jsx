import React, { useState } from "react"
import { useSearchParams, useParams } from "react-router-dom"
import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
  Divider,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import { useLanguage } from "@/shared/context/LanguageContext"
import LevelFilter from "./filters/LevelFilter"
import TopicFilter from "./filters/TopicFilter"

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
  const [searchParams] = useSearchParams()
  const { lang } = useParams()
  const [searchValue, setSearchValue] = useState("")

  // Map URL lang code to language name for levels
  const langMap = {
    en: "english",
    zh: "chinese",
    vi: "vietnamese",
  }
  const currentLanguage = lang ? langMap[lang] : "english"
  const currentLevels = LEVELS[currentLanguage] || LEVELS.english

  const handleSearch = () => {
    // Add search functionality here
    console.log("Search clicked:", searchValue)
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
          {/* Level Filter */}
          <LevelFilter currentLevels={currentLevels} />

          {/* Divider */}
          <Divider sx={{ my: 3 }} />

          {/* Topic Filter */}
          <TopicFilter />
        </Box>
      )}
    </Box>
  )
}

export default RoomFilterSidebar
