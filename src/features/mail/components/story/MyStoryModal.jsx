import React, { useState } from "react"
import dayjs from "dayjs"
import { useLanguage } from "@/shared/context/LanguageContext"

import PillButton from "@/shared/components/ui/PillButton"
import Modal from "@/shared/components/ui/Modal"

const MyStoryModal = ({ open, story, onClose, onDelete }) => {
  const { t } = useLanguage()
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleClose = () => {
    setConfirmDelete(false)
    onClose()
  }

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(story?.storyId)
      handleClose()
    } else {
      setConfirmDelete(true)
    }
  }

  if (!story) return null

  const createdAt = dayjs(story.createDate)
  const expiresAt = dayjs(story.expiresAt)
  const now = dayjs()
  const timeRemaining = expiresAt.diff(now, "minute")
  const hoursRemaining = Math.floor(timeRemaining / 60)
  const minutesRemaining = timeRemaining % 60

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={t.story?.myStory || "My Story"}
    >
      <div className="space-y-4">
        <div>
          <div className="min-h-[60px] rounded-xl bg-gray-100 p-4 text-sm leading-relaxed text-gray-800">
            {story.storyContent}
          </div>
        </div>

        <div className="space-y-3 text-sm text-gray-600">
          <div>
            <p className="font-medium">
              {t.story?.created || "Created"}:
            </p>
            <p>{createdAt.format("MMM D, YYYY h:mm A")}</p>
          </div>

          <div>
            <p className="font-medium">
              {t.story?.expiresIn || "Expires in"}:{" "}
              {hoursRemaining > 0 && `${hoursRemaining}h `}
              {minutesRemaining}m
            </p>
            <p>{expiresAt.format("MMM D, YYYY h:mm A")}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <PillButton variant="secondary" onClick={handleClose}>
            {t.messages?.close || "Close"}
          </PillButton>
          <PillButton onClick={handleDelete}>
            {confirmDelete
              ? t.story?.confirmDelete || "Confirm Delete"
              : t.story?.deleteStory || "Delete Story"}
          </PillButton>
        </div>
      </div>
    </Modal>
  )
}

export default MyStoryModal
