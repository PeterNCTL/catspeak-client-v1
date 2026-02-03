import React, { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  Box,
} from "@mui/material"
import { useLanguage } from "@/context/LanguageContext"

const PassConfirmationModal = ({ open, onResult }) => {
  const { t } = useLanguage()
  const [reportReason, setReportReason] = useState(null)

  const handleConfirm = () => {
    onResult(true) // Confirmed pass
    setReportReason(null)
  }

  const handleCancel = () => {
    onResult(false) // Cancelled
    setReportReason(null)
  }

  const handleReasonToggle = () => {
    setReportReason(
      reportReason === "inappropriate_language"
        ? null
        : "inappropriate_language",
    )
  }

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
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
        {t.catSpeak.passConfirmationTitle}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ py: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={reportReason === "inappropriate_language"}
                onChange={handleReasonToggle}
                sx={{
                  color: "#990011",
                  "&.Mui-checked": {
                    color: "#990011",
                  },
                }}
              />
            }
            label={t.catSpeak.inappropriateLanguage}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleCancel} sx={{ color: "text.secondary" }}>
          {t.catSpeak.cancel}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          sx={{
            backgroundColor: "#990011",
            "&:hover": {
              backgroundColor: "#7a000d",
            },
          }}
        >
          {t.catSpeak.confirm}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PassConfirmationModal
