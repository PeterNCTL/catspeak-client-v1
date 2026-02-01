import { useState } from "react"
import { motion } from "framer-motion"
import { BubblePillMessage } from "@/components/ui/button"
import InDevelopmentModal from "@/components/common/InDevelopmentModal"
import { badges } from "@/constants/constants"
import { useLanguage } from "@/context/LanguageContext"

const SessionActionButtons = ({
  handleCreateOneOnOneSession,
  handleCreateStudyGroupSession,
  isCreatingOneOnOne,
  isCreatingStudyGroup,
}) => {
  const { t } = useLanguage()
  const [isDevelopmentModalOpen, setIsDevelopmentModalOpen] = useState(false)

  return (
    <div className="relative mt-6 pl-6">
      <InDevelopmentModal
        open={isDevelopmentModalOpen}
        onCancel={() => setIsDevelopmentModalOpen(false)}
      />
      {/* Line removed as requested */}
      <div className="relative flex flex-wrap gap-3">
        {badges.map((b) => {
          const Icon = b.icon
          const isOneOnOne = b.id === "connect_1_1"
          const isStudyGroup = b.id === "connect_2_5"
          const isAI = b.id === "your_ai"

          const isActionable = isOneOnOne || isStudyGroup || isAI

          const handleClick = () => {
            if (isOneOnOne) handleCreateOneOnOneSession()
            if (isStudyGroup) handleCreateStudyGroupSession()
            if (isAI) setIsDevelopmentModalOpen(true)
          }

          const isLoadingThis =
            (isOneOnOne && isCreatingOneOnOne) ||
            (isStudyGroup && isCreatingStudyGroup)

          // Map IDs to translation keys
          let labelKey = ""
          if (isOneOnOne) labelKey = "connect11"
          if (isStudyGroup) labelKey = "connect25"
          if (isAI) labelKey = "yourAI"

          const label = labelKey ? t.rooms.sessionActions[labelKey] : b.label

          return (
            <motion.div
              key={b.id}
              className={`text-sm font-semibold flex items-center transform transition-colors duration-200 ease-out`}
              onClick={isActionable ? handleClick : undefined}
            >
              <BubblePillMessage
                asChild
                disabled={!isActionable || isLoadingThis}
              >
                {isActionable && isLoadingThis ? (
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Icon className="mr-2 h-4 w-4" />
                )}
                {label}
              </BubblePillMessage>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
export default SessionActionButtons
