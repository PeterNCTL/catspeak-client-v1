import React, { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import {
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  Box,
} from "@mui/material"
import { useCreateRoomMutation } from "@/features/rooms/api/roomsApi"
import { useLanguage } from "@/shared/context/LanguageContext"
import { colors } from "@/shared/utils/colors"
import RoomNameInput from "./ui/RoomNameInput"
import CategorySelect from "./ui/CategorySelect"
import LevelSelector from "./ui/LevelSelector"
import PillButton from "@/shared/components/ui/PillButton"

// Constants from original components
const CATEGORIES = ["Practice", "Friends", "Trending"]

const LEVELS = {
  English: ["A1", "A2", "B1", "B2", "C1", "C2"],
  Chinese: ["HSK 1", "HSK 2", "HSK 3", "HSK 4", "HSK 5", "HSK 6"],
  // Vietnamese: ["Beginner", "Intermediate", "Advanced"],
}

const CreateRoomModal = ({ open, onCancel }) => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [createRoom, { isLoading }] = useCreateRoomMutation()
  const [searchParams] = useSearchParams()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"))

  const urlLanguage = searchParams.get("language")
  const defaultLanguage = urlLanguage
    ? urlLanguage.charAt(0).toUpperCase() + urlLanguage.slice(1)
    : "English"

  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage)
  const [selectedLevel, setSelectedLevel] = useState("")

  // Form State
  const [name, setName] = useState("")
  const [categories, setCategories] = useState([])

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setName("")
      setCategories([])
      // Keep selectedLanguage from URL or default
      if (defaultLanguage) {
        setSelectedLanguage(defaultLanguage)
      }
      setSelectedLevel("")
    }
  }, [open, defaultLanguage])

  // Update selectedLanguage if URL changes while modal is open
  useEffect(() => {
    if (urlLanguage) {
      const lang = urlLanguage.charAt(0).toUpperCase() + urlLanguage.slice(1)
      setSelectedLanguage(lang)
    }
  }, [urlLanguage])

  const handleCancel = () => {
    onCancel()
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    if (!selectedLanguage) {
      return
    }

    try {
      const response = await createRoom({
        name: name || "",
        roomType: 2, // Group room
        languageType: selectedLanguage,
        requiredLevel: selectedLevel || "",
        categories: categories.length > 0 ? categories : ["Other"],
      }).unwrap()

      const roomId = response.roomId
      handleCancel() // Close modal

      if (roomId) {
        navigate(`/room/${roomId}`)
      }
    } catch (err) {
      console.error("Failed to create room:", err)
    }
  }

  const handleCategoryChange = (event) => {
    const newValue = event.target.value
    const newCategories =
      typeof newValue === "string" ? newValue.split(",") : newValue
    const maxLimit = 3

    if (newCategories.length <= maxLimit) {
      setCategories(newCategories)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick" && handleCancel) {
          handleCancel()
        }
      }}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "24px",
          padding: 2,
        },
      }}
    >
      <Box component="div">
        <DialogTitle
          sx={{
            textAlign: "center",
            color: colors.headingColor,
          }}
        >
          {t.rooms.createRoom.title}
        </DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {/* Room Name */}
            <RoomNameInput
              value={name}
              onChange={(e) => setName(e.target.value)}
              t={t}
            />

            {/* Categories */}
            <CategorySelect
              value={categories}
              onChange={handleCategoryChange}
              options={CATEGORIES}
              t={t}
            />

            {/* Level Selection */}
            <LevelSelector
              selectedLevel={selectedLevel}
              onSelect={setSelectedLevel}
              levels={LEVELS[selectedLanguage]}
              t={t}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: "center", gap: 1 }}>
          <PillButton onClick={handleCancel} variant="text" color="inherit">
            {t.rooms.createRoom.cancel}
          </PillButton>
          <PillButton
            onClick={handleSubmit}
            loading={isLoading}
            disabled={!selectedLanguage}
          >
            {t.rooms.createRoom.create}
          </PillButton>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default CreateRoomModal
