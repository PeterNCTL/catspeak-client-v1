import React, { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
} from "@mui/material"
import dayjs from "dayjs"
import { useLanguage } from "@/context/LanguageContext"

import PillButton from "@/components/ui/PillButton"

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
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          padding: 2,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, fontWeight: "bold" }}>
        {t.catSpeak?.myStory || "My Story"}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body1"
            sx={{
              backgroundColor: "#f5f5f5",
              padding: 2,
              borderRadius: 2,
              minHeight: 60,
              lineHeight: 1.6,
            }}
          >
            {story.storyContent}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box>
            <Typography variant="body2" color="text.secondary" fontWeight="500">
              {t.catSpeak?.created || "Created"}:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {createdAt.format("MMM D, YYYY h:mm A")}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary" fontWeight="500">
              {t.catSpeak?.expiresIn || "Expires in"}:{" "}
              {hoursRemaining > 0 && `${hoursRemaining}h `}
              {minutesRemaining}m
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {expiresAt.format("MMM D, YYYY h:mm A")}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ gap: 1 }}>
        <PillButton
          onClick={handleClose}
          variant="text"
          color="inherit"
        >
          {t.common?.close || "Close"}
        </PillButton>
        <PillButton
          onClick={handleDelete}
        >
          {confirmDelete
            ? t.catSpeak?.confirmDelete || "Confirm Delete"
            : t.catSpeak?.deleteStory || "Delete Story"}
        </PillButton>
      </DialogActions>
    </Dialog>
  )
}

export default MyStoryModal
