import React, { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import {
  useCreateRoomMutation,
  useJoinRoomMutation,
} from "@/features/rooms/api/roomsApi"
import { useLanguage } from "@/shared/context/LanguageContext"
import RoomNameInput from "./ui/RoomNameInput"
import CategorySelect from "./ui/CategorySelect"
import LevelSelector from "./ui/LevelSelector"
import PillButton from "@/shared/components/ui/PillButton"
import Modal from "@/shared/components/ui/Modal"

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
  const [joinRoom, { isLoading: isJoining }] = useJoinRoomMutation()
  const [createRoom, { isLoading: isCreating }] = useCreateRoomMutation()
  const isLoading = isJoining || isCreating
  const [searchParams] = useSearchParams()

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

    const roomData = {
      name: name || "",
      roomType: 2, // Group room
      languageType: selectedLanguage,
      requiredLevel: selectedLevel || "",
      categories: categories.length > 0 ? categories : ["Other"],
    }

    try {
      // 1. Try to join an existing room first
      console.log("Attempting to join existing room...", roomData)
      try {
        const joinResult = await joinRoom({
          topic: roomData.categories[0], // Use first category as topic
          requiredLevel: roomData.requiredLevel,
          languageType: roomData.languageType,
          roomType: roomData.roomType,
        }).unwrap()

        console.log("Joined existing room:", joinResult)
        if (joinResult && joinResult.roomId) {
          handleCancel()
          navigate(`/room/${joinResult.roomId}`)
          return
        }
      } catch (joinError) {
        // If 404, it means no room found, so proceed to create
        if (joinError?.status === 404 || joinError?.originalStatus === 404) {
          console.log("No room found, creating a new one...")
        } else {
          // If it's another error, throw it to outer catch
          throw joinError
        }
      }

      // 2. If join failed (404), create a new room
      const createResult = await createRoom(roomData).unwrap()
      console.log("Created new room:", createResult)

      const roomId = createResult.roomId
      handleCancel() // Close modal

      if (roomId) {
        navigate(`/room/${roomId}`)
      }
    } catch (err) {
      console.error("Failed to join or create room:", err)
      // Optional: Add toast notification here
    }
  }

  const handleCategoryChange = (event) => {
    // Check if event is from custom component (has target.value) or standard event
    const newValue = event.target ? event.target.value : event
    const maxLimit = 3

    // Safety check for array
    if (Array.isArray(newValue)) {
      if (newValue.length <= maxLimit) {
        setCategories(newValue)
      }
    }
  }

  if (!open) return null

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      title={t.rooms.createRoom.title}
      className="max-w-sm sm:max-w-md"
    >
      <div className="flex flex-col gap-5">
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
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <PillButton onClick={handleCancel} variant="text" color="inherit">
          {t.rooms.createRoom.cancel}
        </PillButton>
        <PillButton
          onClick={handleSubmit}
          loading={isLoading}
          loadingText={t.rooms.createRoom.joining}
          disabled={!selectedLanguage}
        >
          {t.rooms.createRoom.create}
        </PillButton>
      </div>
    </Modal>
  )
}

export default CreateRoomModal
