import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useLanguage } from "@/shared/context/LanguageContext"
import TopicSelect from "@/features/rooms/components/ui/TopicSelect"
import LevelSelector from "@/features/rooms/components/ui/LevelSelector"
import PillButton from "@/shared/components/ui/buttons/PillButton"
import Modal from "@/shared/components/ui/Modal"
import { TOPICS, LEVELS } from "@/features/rooms/config/constants"

const QueueModal = ({ open, onCancel, roomType = "OneToOne" }) => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { lang } = useParams()

  const getLanguageName = (langCode) => {
    switch (langCode) {
      case "zh":
        return "Chinese"
      case "vi":
        return "Vietnamese"
      case "en":
        return "English"
      default:
        return "English"
    }
  }

  const supportedLangCode = ["zh", "vi", "en"].includes(lang) ? lang : "en"
  const selectedLanguage = getLanguageName(supportedLangCode)

  const [selectedLevel, setSelectedLevel] = useState("")
  const [topics, setTopics] = useState([])

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setTopics([])
      setSelectedLevel("")
    }
  }, [open])

  const handleTopicChange = (event) => {
    const newValue = event.target ? event.target.value : event
    const maxLimit = 3

    if (Array.isArray(newValue)) {
      if (newValue.length <= maxLimit) {
        setTopics(newValue)
      }
    }
  }

  const handleFindMatch = () => {
    const preferences = {
      roomType,
      topics: topics.length > 0 ? topics : [],
      languageType: selectedLanguage,
      requiredLevel: selectedLevel || undefined,
    }

    onCancel()
    navigate("/queue", { state: preferences })
  }

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={t.rooms.queue.title}
      className="max-w-sm min-[426px]:max-w-md max-[425px]:max-w-none max-[425px]:h-full max-[425px]:flex max-[425px]:flex-col"
    >
      <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto -mx-5 px-5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#990011] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5 max-[425px]:max-h-none max-[425px]:flex-1">
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
        <PillButton onClick={onCancel} variant="secondary" className="h-10">
          {t.rooms.queue.cancel}
        </PillButton>
        <PillButton onClick={handleFindMatch} className="h-10">
          {t.rooms.queue.findMatch}
        </PillButton>
      </div>
    </Modal>
  )
}

export default QueueModal
