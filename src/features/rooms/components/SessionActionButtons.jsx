import { useState } from "react"
import { motion } from "framer-motion"
import InDevelopmentModal from "@/shared/components/common/InDevelopmentModal"
import { badges } from "@/shared/constants/constants"
import { useLanguage } from "@/shared/context/LanguageContext"
import PillButton from "@/shared/components/ui/PillButton"

const SessionActionButtons = ({
  handleCreateOneOnOneSession,
  handleCreateStudyGroupSession,
  isCreatingOneOnOne,
  isCreatingStudyGroup,
}) => {
  const { t } = useLanguage()
  const [isDevelopmentModalOpen, setIsDevelopmentModalOpen] = useState(false)

  return (
    <div className="relative">
      <InDevelopmentModal
        open={isDevelopmentModalOpen}
        onCancel={() => setIsDevelopmentModalOpen(false)}
      />
      {/* Line removed as requested */}
      <div className="relative flex flex-col min-[426px]:flex-row min-[426px]:flex-wrap gap-2 sm:gap-3">
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
              className={`text-xs sm:text-sm font-semibold flex items-center transform transition-colors duration-200 ease-out w-full min-[426px]:w-auto`}
              onClick={isActionable ? handleClick : undefined}
            >
              <PillButton
                disabled={!isActionable || isLoadingThis}
                loading={isActionable && isLoadingThis}
                startIcon={<Icon />}
                className="whitespace-nowrap w-full min-[426px]:w-auto min-[426px]:min-w-[120px] justify-center"
              >
                {label}
              </PillButton>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
export default SessionActionButtons
