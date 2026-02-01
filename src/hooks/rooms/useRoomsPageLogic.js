import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useCreateVideoSessionMutation } from "@/store/api/videoSessionsApi"
import { useLanguage } from "@/context/LanguageContext"
import { useAuthModal } from "@/context/AuthModalContext"
import useAuth from "@/hooks/useAuth"

export const useRoomsPageLogic = () => {
  const { t } = useLanguage()
  // Ensure we have slides from translation, fallback if structure missing to avoid crash
  const slides = t?.rooms?.heroCarousel?.slides || []

  const [active, setActive] = useState(0)
  const [allowConnect, setAllowConnect] = useState(false)
  const [page, setPage] = useState(1)
  const [tab, setTab] = useState("communicate")
  const [liveInput, setLiveInput] = useState("")
  const [userLetters, setUserLetters] = useState(2)
  const totalLetters = 220

  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { openAuthModal } = useAuthModal()
  const [createVideoSession, { isLoading: isCreating }] =
    useCreateVideoSessionMutation()

  // Separate loading states
  const [isCreatingOneOnOne, setIsCreatingOneOnOne] = useState(false)
  const [isCreatingStudyGroup, setIsCreatingStudyGroup] = useState(false)

  /*
   * NEW: Modal State for Create Room
   */
  const [isCreateRoomModalOpen, setCreateRoomModalOpen] = useState(false)

  const handleCreateOneOnOneSession = () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Show login popup instead of navigating to login page
      openAuthModal("login")
      return
    }
    // If authenticated, navigate to queue page
    navigate("/queue")
  }

  const handleCreateStudyGroupSession = () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      openAuthModal("login")
      return
    }

    // Open Modal instead of navigating
    setCreateRoomModalOpen(true)
  }

  const current = useMemo(() => slides[active] || {}, [active, slides])

  const handleSendLive = (msg) => {
    if (!msg?.trim()) return
    setUserLetters((n) => n + 1)
    setLiveInput("")
  }

  const next = () => setActive((p) => (p + 1) % slides.length)
  const prev = () => setActive((p) => (p - 1 + slides.length) % slides.length)

  return {
    state: {
      active,
      allowConnect,
      page,
      tab,
      liveInput,
      userLetters,
      totalLetters,
      isCreating: isCreating || isCreatingOneOnOne || isCreatingStudyGroup, // Backward compatibility or global loading
      isCreatingOneOnOne,
      isCreatingStudyGroup,
      isCreateRoomModalOpen,
    },
    derived: {
      current,
      slides, // Export slides so UI components can use the same translated list
    },
    actions: {
      setActive,
      setAllowConnect,
      setPage,
      setTab,
      setLiveInput,
      handleCreateOneOnOneSession,
      handleCreateStudyGroupSession,
      handleSendLive,
      next,
      prev,
      setCreateRoomModalOpen,
    },
  }
}
