import { useState } from "react"
import { motion } from "framer-motion"
import { BubblePillMessage } from "@/shared/components/ui/button"
import InDevelopmentModal from "@/shared/components/common/InDevelopmentModal"
import { badges } from "@/shared/constants/constants"
import { useLanguage } from "@/shared/context/LanguageContext"

const SessionActionButtons = ({
  handleCreateOneOnOneSession,
  handleCreateStudyGroupSession,
  isCreatingOneOnOne,
  isCreatingStudyGroup,
}) => {
  const { t } = useLanguage()
  const [isDevelopmentModalOpen, setIsDevelopmentModalOpen] = useState(false)

  return (
    <div className="relative mt-4 sm:mt-6 pl-4 sm:pl-6">
      <InDevelopmentModal
        open={isDevelopmentModalOpen}
        onCancel={() => setIsDevelopmentModalOpen(false)}
      />
      {/* Line removed as requested */}
      <div className="relative flex flex-wrap gap-2 sm:gap-3">
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
              className={`text-xs sm:text-sm font-semibold flex items-center transform transition-colors duration-200 ease-out`}
              onClick={isActionable ? handleClick : undefined}
            >
              <BubblePillMessage
                asChild
                disabled={!isActionable || isLoadingThis}
              >
                {isActionable && isLoadingThis ? (
                  <span className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Icon className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
