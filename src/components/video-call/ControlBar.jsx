import React from "react"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Divider from "@mui/material/Divider"
import Tooltip from "@mui/material/Tooltip"
import VideocamIcon from "@mui/icons-material/Videocam"
import VideocamOffIcon from "@mui/icons-material/VideocamOff"
import ScreenShareIcon from "@mui/icons-material/ScreenShare"
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline"
import GroupIcon from "@mui/icons-material/Group"
import MoreVertIcon from "@mui/icons-material/MoreVert"

import MicButton from "@/components/video-call/MicButton"
import InDevelopmentModal from "@/components/common/InDevelopmentModal"
import PillButton from "@/components/ui/PillButton"

const VideoCallControlBar = ({
  micOn,
  cameraOn,
  showChat,
  setShowChat,
  showParticipants,
  setShowParticipants,
  unreadMessages,
  localStream,
  isLeaving,
  handleToggleMic,
  handleToggleCam,
  handleLeaveSession,
}) => {
  const [showDevModal, setShowDevModal] = React.useState(false)

  return (
    <>
      <Box className="flex w-full flex-col gap-3 border-t border-gray-200 bg-white px-3 py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-3">
        <Box className="hidden w-32 text-sm font-semibold text-headingColor sm:block">
          {/* Timer Placeholder */}
        </Box>

        <Box className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          <MicButton
            micOn={micOn}
            onToggle={handleToggleMic}
            stream={localStream}
            className="z-10"
          />

          <Tooltip title={cameraOn ? "Turn camera off" : "Turn camera on"}>
            <IconButton
              onClick={handleToggleCam}
              size="large"
              sx={{
                borderRadius: "9999px",
                boxShadow: 2,
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: cameraOn ? "transparent" : "grey.300",
                bgcolor: cameraOn ? "error.main" : "common.white",
                color: cameraOn ? "common.white" : "error.light",
                "&:hover": {
                  bgcolor: cameraOn ? "error.dark" : "grey.100",
                },
              }}
            >
              {cameraOn ? <VideocamIcon /> : <VideocamOffIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Screen share (in development)">
            <IconButton
              onClick={() => setShowDevModal(true)}
              size="large"
              sx={{
                borderRadius: "9999px",
                boxShadow: 1,
                border: "1px solid",
                borderColor: "grey.300",
                bgcolor: "common.white",
                color: "grey.600",
                "&:hover": {
                  bgcolor: "grey.100",
                  color: "text.primary",
                },
              }}
            >
              <ScreenShareIcon />
            </IconButton>
          </Tooltip>

          <Divider
            orientation="vertical"
            flexItem
            sx={{
              mx: 2,
              borderColor: "grey.200",
              display: { xs: "none", sm: "block" },
            }}
          />

          {/* Participants Toggle */}
          <Tooltip title="Participants">
            <IconButton
              onClick={() => {
                setShowParticipants(!showParticipants)
                setShowChat(false)
              }}
              size="large"
              sx={{
                borderRadius: "9999px",
                boxShadow: 2,
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: showParticipants ? "transparent" : "grey.300",
                bgcolor: showParticipants ? "warning.main" : "common.white",
                color: showParticipants ? "common.white" : "grey.600",
                "&:hover": {
                  bgcolor: showParticipants ? "warning.dark" : "grey.100",
                  color: "text.primary",
                },
              }}
            >
              <GroupIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Chat">
            <Box className="relative">
              <IconButton
                onClick={() => {
                  setShowChat(!showChat)
                  setShowParticipants(false)
                }}
                size="large"
                sx={{
                  borderRadius: "9999px",
                  boxShadow: 2,
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: showChat ? "transparent" : "grey.300",
                  bgcolor: showChat ? "warning.main" : "common.white",
                  color: showChat ? "common.white" : "grey.600",
                  "&:hover": {
                    bgcolor: showChat ? "warning.dark" : "grey.100",
                    color: "text.primary",
                  },
                }}
              >
                <ChatBubbleOutlineIcon />
              </IconButton>
              {unreadMessages > 0 && (
                <Box className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm animate-bounce">
                  {unreadMessages > 9 ? "9+" : unreadMessages}
                </Box>
              )}
            </Box>
          </Tooltip>

          <Tooltip title="More">
            <IconButton
              size="large"
              sx={{
                borderRadius: "9999px",
                border: "1px solid",
                borderColor: "grey.300",
                bgcolor: "common.white",
                color: "grey.600",
                boxShadow: 1,
                "&:hover": {
                  bgcolor: "grey.100",
                  color: "text.primary",
                },
              }}
            >
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Box className="flex w-full justify-center sm:w-32 sm:justify-end">
          <PillButton
            onClick={handleLeaveSession}
            disabled={isLeaving}
          >
            {isLeaving ? "Leaving..." : "Leave"}
          </PillButton>
        </Box>
      </Box>

      <InDevelopmentModal
        open={showDevModal}
        onCancel={() => setShowDevModal(false)}
      />
    </>
  )
}

export default VideoCallControlBar


