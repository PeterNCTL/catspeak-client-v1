import React from "react"
import { Modal } from "antd"
import { Button, Typography, Box } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useLanguage } from "@/context/LanguageContext"
import colors from "@/utils/colors"

const InDevelopmentModal = ({ open, onCancel }) => {
  const { t } = useLanguage()
  const navigate = useNavigate()

  // Safeguard against missing translations
  const comingSoon = t?.comingSoon || {}

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      className="in-development-modal"
      width={400}
    >
      <div className="flex flex-col items-center justify-center p-6 text-center">
        {/* You can add an illustration here if desired from constants or assets */}
        <Typography
          variant="h5"
          component="h2"
          sx={{ fontWeight: "bold", color: "text.primary", mb: 2 }}
        >
          {comingSoon.title || "Feature in Development"}
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "text.secondary", mb: 3, fontWeight: 500 }}
        >
          {comingSoon.description ||
            "We are working hard to bring you this feature."}
        </Typography>

        <Typography variant="body2" sx={{ color: "text.secondary", mb: 4 }}>
          {comingSoon.thankYou || "Thank you for your patience!"}
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={onCancel}
          sx={{
            bgcolor: colors.red[700],
            "&:hover": {
              bgcolor: colors.red[800],
            },
            borderRadius: "9999px", // rounded-full
            px: 4,
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          {comingSoon.backToHome || "Close"}
        </Button>
      </div>
    </Modal>
  )
}

export default InDevelopmentModal
