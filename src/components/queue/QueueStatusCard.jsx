import React from "react"
import {
  Typography,
  Paper,
  Button,
  Box,
  CircularProgress,
  Stack,
  alpha,
  Divider,
} from "@mui/material"
import { useLanguage } from "@context/LanguageContext"

const QueueStatusCard = ({ statusText, isConnected, position, onCancel }) => {
  const { t } = useLanguage()

  return (
    <Paper
      elevation={4}
      sx={{
        maxWidth: 400,
        width: "100%",
        borderRadius: 5,
        overflow: "hidden",
        position: "relative",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      {/* Header / Loading State */}
      <Box
        sx={{
          bgcolor: alpha("#990011", 0.04), // Subtle tint matching brand
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box sx={{ position: "relative", display: "inline-flex" }}>
          <CircularProgress
            size={72}
            thickness={4}
            sx={{
              color: "#990011",
              opacity: 0.8,
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h4" component="div">
              😺
            </Typography>
          </Box>
        </Box>

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {statusText}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t.rooms.queue.findingMatch}
          </Typography>
        </Box>
      </Box>

      <Divider />

      <Box sx={{ p: 3 }}>
        {/* Info Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2,
            mb: 3,
          }}
        >
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "grey.50",
              border: "1px solid",
              borderColor: "divider",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight="600"
              gutterBottom
            >
              {t.rooms.queue.status}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: isConnected ? "success.main" : "warning.main",
                  boxShadow: 1,
                  animation: !isConnected ? "pulse 2s infinite" : "none",
                  "@keyframes pulse": {
                    "0%": { opacity: 1 },
                    "50%": { opacity: 0.5 },
                    "100%": { opacity: 1 },
                  },
                }}
              />
              <Typography variant="body2" fontWeight="medium">
                {isConnected
                  ? t.rooms.queue.connected
                  : t.rooms.queue.connecting}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: "grey.50",
              border: "1px solid",
              borderColor: "divider",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight="600"
              gutterBottom
            >
              {t.rooms.queue.position}
            </Typography>
            <Typography
              variant="h6"
              fontWeight="bold"
              color="#990011"
              sx={{ lineHeight: 1 }}
            >
              {position > 0 ? `#${position}` : "--"}
            </Typography>
          </Box>
        </Box>

        {/* Action Button */}
        <Button
          onClick={onCancel}
          variant="contained"
          fullWidth
          size="large"
          sx={{
            backgroundColor: "#990011",
            "&:hover": {
              backgroundColor: "#7a000d",
            },
            borderRadius: 2,
            py: 1.5,
            fontWeight: "bold",
            fontSize: "1rem",
            boxShadow: 2,
          }}
        >
          {t.rooms.queue.cancelSearch}
        </Button>
      </Box>
    </Paper>
  )
}

export default QueueStatusCard
