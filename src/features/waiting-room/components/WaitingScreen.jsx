import React from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Box, Typography, Stack } from "@mui/material"
import { ArrowBack } from "@mui/icons-material"
import { colors } from "@/shared/utils/colors"
import PillButton from "@/shared/components/ui/PillButton"
import ParticipantList from "./ParticipantList"
import VideoPreview from "./VideoPreview"
import { useLanguage } from "@/shared/context/LanguageContext"

const WaitingScreen = ({
  session,
  localStream,
  micOn,
  cameraOn,
  user,
  onToggleMic,
  onToggleCam,
  onJoin,
}) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const participants = session?.participants || []
  const { t } = useLanguage()

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        bgcolor: "background.default",
        p: { xs: 2, md: 0 },
      }}
    >
      {/* Back Button */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: 16, md: 32 },
          left: { xs: 16, md: 32 },
          zIndex: 10,
        }}
      >
        <PillButton
          variant="text"
          color="inherit"
          startIcon={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                borderRadius: "50%",
                bgcolor: "white",
                boxShadow: "0px 1px 2px rgba(0,0,0,0.05)",
                border: `1px solid ${colors.border}`,
              }}
            >
              <ArrowBack sx={{ fontSize: 20 }} />
            </Box>
          }
          onClick={() =>
            navigate({
              pathname: "/community",
              search: searchParams.toString(),
            })
          }
          sx={{
            color: colors.textGray,
            "&:hover": { color: colors.headingColor, bgcolor: "transparent" },
            pl: { xs: 0, md: 2 }, // Adjust padding on mobile if needed
          }}
        >
          <Typography fontWeight="500">
            {t.rooms.waitingScreen.backToCommunity}
          </Typography>
        </PillButton>
      </Box>

      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography
          variant="h4"
          sx={{
            mb: 1,
            fontWeight: 600,
            color: colors.headingColor,
            fontSize: { xs: "1.5rem", md: "2.125rem" }, // Responsive font size
          }}
        >
          {session?.name ||
            session?.roomName ||
            t.rooms.waitingScreen.readyToJoin}
        </Typography>

        <ParticipantList participants={participants} />
      </Box>

      <VideoPreview
        localStream={localStream}
        micOn={micOn}
        cameraOn={cameraOn}
        user={user}
        onToggleMic={onToggleMic}
        onToggleCam={onToggleCam}
      />

      <Stack alignItems="center" spacing={2}>
        <PillButton onClick={onJoin}>
          {t.rooms.waitingScreen.joinNow}
        </PillButton>
        <Typography variant="body2" color="text.secondary">
          {t.rooms.waitingScreen.joinedAs}{" "}
          <Typography
            component="span"
            variant="body2"
            sx={{ fontWeight: 500, color: colors.headingColor }}
          >
            {user?.username}
          </Typography>
        </Typography>
      </Stack>
    </Box>
  )
}

export default WaitingScreen
