import React, { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { useNavigate, useParams } from "react-router-dom"
import {
  useCreateRoomMutation,
  useJoinRoomMutation,
} from "@/store/api/roomsApi"
import { useLanguage } from "@/shared/context/LanguageContext"
import TextInput from "@/shared/components/ui/TextInput"
import TopicSelect from "./ui/TopicSelect"
import LevelSelector from "./ui/LevelSelector"
import PillButton from "@/shared/components/ui/PillButton"
import Modal from "@/shared/components/ui/Modal"
import { TOPICS, LEVELS } from "../config/constants"

const CreateRoomModal = ({ open, onCancel }) => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { lang } = useParams()

  const [joinRoom, { isLoading: isJoining }] = useJoinRoomMutation()
  const [createRoom, { isLoading: isCreating }] = useCreateRoomMutation()
  const isLoading = isJoining || isCreating

  const getLanguageName = (langCode) => {
    switch (langCode) {
      case "zh":
        return "Chinese"
      case "vi":
        return "Vietnamese"
      case "en":
        return "English"
      default:
        return "English" // Default fallback
    }
  }

  // Derive selectedLanguage directly from URL params
  const supportedLangCode = ["zh", "vi", "en"].includes(lang) ? lang : "en"
  const selectedLanguage = getLanguageName(supportedLangCode)

  const [selectedLevel, setSelectedLevel] = useState("")

  // Form State
  const [name, setName] = useState("")
  const [topics, setTopics] = useState([])

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setName("")
      setTopics([])
      setSelectedLevel("")
    }
  }, [open])

  const handleCancel = () => {
    onCancel()
  }

  const handleJoin = async (e) => {
    if (e) e.preventDefault()
    if (!selectedLanguage) return

    const formData = new FormData()
    formData.append("requiredLevel", selectedLevel || "")
    formData.append("languageType", selectedLanguage)
    formData.append("roomType", "Group") // Group room
    formData.append("topic", topics.length > 0 ? topics[0] : "Other")

    try {
      const joinResult = await joinRoom(formData).unwrap()

      if (joinResult && joinResult.roomId) {
        handleCancel()
        navigate(`/room/${joinResult.roomId}`)
      }
    } catch (err) {
      const is404 = err?.status === 404 || err?.data?.statusCode === 404

      if (is404) {
        toast.error(t.errors.rooms.noRoomFound, {
          id: "join-room-error",
        })
        return
      }

      toast.error(t.errors.rooms.genericJoinError, {
        id: "join-room-error",
      })

      console.error("Join room failed:", err)
    }
  }

  const handleCreate = async (e) => {
    if (e) e.preventDefault()
    if (!selectedLanguage) return

    const formData = new FormData()
    formData.append("Name", name || "")
    formData.append("RoomType", "Group") // Group room
    formData.append("LanguageType", selectedLanguage)
    formData.append("RequiredLevel", selectedLevel || "")

    const topicsList = topics.length > 0 ? topics : ["Other"]
    topicsList.forEach((topic) => formData.append("Topics", topic))

    try {
      const createResult = await createRoom(formData).unwrap()

      const roomId = createResult.roomId
      handleCancel()

      if (roomId) {
        navigate(`/room/${roomId}`)
      }
    } catch (err) {
      console.error("Failed to create room:", err)
    }
  }

  const handleTopicChange = (event) => {
    // Check if event is from custom component (has target.value) or standard event
    const newValue = event.target ? event.target.value : event
    const maxLimit = 3

    // Safety check for array
    if (Array.isArray(newValue)) {
      if (newValue.length <= maxLimit) {
        setTopics(newValue)
      }
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      title={t.rooms.createRoom.title}
      className="max-w-sm min-[426px]:max-w-md max-[425px]:max-w-none max-[425px]:h-full max-[425px]:flex max-[425px]:flex-col"
    >
      <div className="flex flex-col gap-5 max-h-[60vh] overflow-y-auto -mx-5 px-5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#990011] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5 max-[425px]:max-h-none max-[425px]:flex-1">
        {/* Room Name */}
        <TextInput
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          label={t.rooms.createRoom.nameLabel}
          placeholder={t.rooms.createRoom.namePlaceholder}
          autoFocus
        />

        {/* Topics */}
        <TopicSelect
          value={topics}
          onChange={handleTopicChange}
          options={TOPICS}
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

      <div className="mt-8 flex justify-center gap-2">
        <PillButton onClick={handleCancel} variant="secondary" className="h-10">
          {t.rooms.createRoom.cancel}
        </PillButton>
        <PillButton
          onClick={handleJoin}
          className="h-10"
          loading={isJoining}
          loadingText={t.rooms.createRoom.joining}
          disabled={!selectedLanguage || isLoading}
        >
          {t.rooms.createRoom.join}
        </PillButton>
        <PillButton
          onClick={handleCreate}
          className="h-10"
          loading={isCreating}
          loadingText={t.rooms.createRoom.creating}
          disabled={!selectedLanguage || isLoading}
        >
          {t.rooms.createRoom.create}
        </PillButton>
      </div>
    </Modal>
  )
}

export default CreateRoomModal
