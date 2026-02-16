import React from "react"
import { Box, Paper, Avatar, Chip, styled } from "@mui/material"
import MicOff from "@mui/icons-material/MicOff"
import { colors } from "@/shared/utils/colors"
import MediaControls from "./MediaControls"
import { useLanguage } from "@/shared/context/LanguageContext"

// Styled Video component
const StyledVideo = styled("video")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transform: "scaleX(-1)", // Mirror effect
})

const VideoPreview = ({
  localStream,
  micOn,
  cameraOn,
  user,
  onToggleMic,
  onToggleCam,
}) => {
  const { t } = useLanguage()
  return (
    <Paper
      elevation={0}
      sx={{
        position: "relative",
        mb: 4,
        height: { xs: 300, sm: 350, md: 400 },
        width: { xs: "100%", sm: "90%", md: 700 }, // Responsive width
        overflow: "hidden",
        borderRadius: "24px",
        bgcolor: "white",
        boxShadow:
          "0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 8px 10px -6px rgba(0, 0, 0, 0.1)", // shadow-xl equivalent
        border: `1px solid ${colors.border}`,
      }}
    >
      {/* Video Preview */}
      {localStream && (
        <StyledVideo
          ref={(video) => {
            if (video) {
              video.srcObject = localStream
              if (micOn) video.muted = true // Mute local preview to prevent echo
            }
          }}
          autoPlay
          playsInline
          muted // Always mute local video preview purely for UI
          className={!cameraOn ? "hidden" : ""}
        />
      )}

      {!cameraOn && (
        <Box
          sx={{
            display: "flex",
            height: "100%",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Avatar
            sx={{
              width: { xs: 64, md: 96 },
              height: { xs: 64, md: 96 },
              bgcolor: "white",
              color: colors.red[600],
              fontSize: { xs: 24, md: 36 },
              fontWeight: "bold",
              boxShadow: 3,
              border: "1px solid #f3f4f6",
            }}
          >
            {user?.username?.[0]?.toUpperCase() || "U"}
          </Avatar>
        </Box>
      )}

      {/* Controls Overlay */}
      <MediaControls
        micOn={micOn}
        cameraOn={cameraOn}
        onToggleMic={onToggleMic}
        onToggleCam={onToggleCam}
      />

      {/* Mic Status Indicator */}
      {!micOn && (
        <Box
          sx={{
            position: "absolute",
            top: { xs: 12, md: 16 },
            right: { xs: 12, md: 16 },
            zIndex: 10,
          }}
        >
          <Chip
            icon={<MicOff sx={{ width: 16, height: 16 }} />}
            label={t.rooms.waitingScreen.micOff}
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(4px)",
              color: colors.red[500],
              fontWeight: 500,
              border: "1px solid #f3f4f6",
              "& .MuiChip-icon": {
                color: colors.red[500],
              },
            }}
          />
        </Box>
      )}
    </Paper>
  )
}

export default VideoPreview
