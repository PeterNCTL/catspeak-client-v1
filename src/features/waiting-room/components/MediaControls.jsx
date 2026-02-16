import React from "react"
import { Stack, IconButton } from "@mui/material"
import Mic from "@mui/icons-material/Mic"
import MicOff from "@mui/icons-material/MicOff"
import Videocam from "@mui/icons-material/Videocam"
import VideocamOff from "@mui/icons-material/VideocamOff"
import { colors } from "@/shared/utils/colors"

const MediaControls = ({ micOn, cameraOn, onToggleMic, onToggleCam }) => {
  return (
    <Stack
      direction="row"
      spacing={3}
      sx={{
        position: "absolute",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10,
      }}
    >
      <IconButton
        onClick={onToggleMic}
        sx={{
          width: 56,
          height: 56,
          bgcolor: micOn ? colors.red[600] : "white",
          color: micOn ? "white" : colors.red[400],
          border: micOn ? "none" : `1px solid ${colors.border}`,
          boxShadow: 3,
          transition: "all 0.2s",
          "&:hover": {
            bgcolor: micOn ? colors.red[700] : colors.primary2,
          },
        }}
      >
        {micOn ? <Mic /> : <MicOff />}
      </IconButton>

      <IconButton
        onClick={onToggleCam}
        sx={{
          width: 56,
          height: 56,
          bgcolor: cameraOn ? colors.red[600] : "white",
          color: cameraOn ? "white" : colors.red[400],
          border: cameraOn ? "none" : `1px solid ${colors.border}`,
          boxShadow: 3,
          transition: "all 0.2s",
          "&:hover": {
            bgcolor: cameraOn ? colors.red[700] : colors.primary2,
          },
        }}
      >
        {cameraOn ? <Videocam /> : <VideocamOff />}
      </IconButton>
    </Stack>
  )
}

export default MediaControls
