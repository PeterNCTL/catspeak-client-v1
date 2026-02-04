import MicIcon from "@mui/icons-material/Mic"
import MicOffIcon from "@mui/icons-material/MicOff"
import VideocamIcon from "@mui/icons-material/Videocam"
import VideocamOffIcon from "@mui/icons-material/VideocamOff"
import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material"
import useAudioLevel from "@/hooks/useAudioLevel"
import { useVideoCallContext } from "@/context/video/VideoCallContext"

const ParticipantItem = ({ participant, isMe, stream, localMicOn, localCameraOn }) => {
  const audioLevel = useAudioLevel(stream)

  const isMicOn = isMe ? localMicOn : participant.isMicOn !== false
  const isCameraOn = isMe ? localCameraOn : participant.isCameraOn !== false
  const username = participant.username || "Unknown"
  const initial = username.charAt(0).toUpperCase()

  return (
    <ListItem
      sx={{
        pl: 1.5,
        pr: 10, // reserve space for secondaryAction icons
        py: 1,
        borderRadius: 1,
        "&:hover": {
          backgroundColor: "grey.100",
        },
      }}
      secondaryAction={
        <Stack direction="row" spacing={1} alignItems="center">
          {isCameraOn ? (
            <VideocamIcon sx={{ fontSize: 18, color: "grey.500" }} />
          ) : (
            <VideocamOffIcon sx={{ fontSize: 18, color: "error.light" }} />
          )}
          {isMicOn ? (
            <MicIcon sx={{ fontSize: 18, color: "grey.500" }} />
          ) : (
            <MicOffIcon sx={{ fontSize: 18, color: "error.light" }} />
          )}
        </Stack>
      }
    >
      <ListItemAvatar>
        <Box sx={{ position: "relative", width: 40, height: 40 }}>
          <Avatar
            src={participant.avatarImageUrl || undefined}
            alt={username}
            sx={{
              width: 40,
              height: 40,
              border: 1,
              borderColor: "grey.200",
              bgcolor: participant.avatarImageUrl ? "grey.100" : "grey.300",
              color: participant.avatarImageUrl ? "text.primary" : "grey.800",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {initial}
          </Avatar>
          {isMicOn && audioLevel > 5 && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                borderWidth: 2,
                borderStyle: "solid",
                borderColor: "success.main",
                opacity: 0.8,
                boxShadow: "0 0 10px rgba(46, 125, 50, 0.6)",
                transform: `scale(${1 + Math.min(audioLevel / 50, 0.3)})`,
                transition: "transform 100ms ease-out",
              }}
            />
          )}
        </Box>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography
            variant="body2"
            noWrap
            sx={{
              fontWeight: 500,
              color: "text.primary",
            }}
          >
            {username} {isMe && "(You)"}
          </Typography>
        }
      />
    </ListItem>
  )
}

const ParticipantList = ({ participants, currentUserId }) => {
  const { micOn, cameraOn } = useVideoCallContext() || {}
  const count = Array.isArray(participants) ? participants.length : 0

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="subtitle2" fontWeight={600}>
          Participants ({count})
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 1,
        }}
      >
        <List dense disablePadding>
          {participants?.map((p) => {
            const currentId = String(currentUserId)
            const isMe =
              String(p.accountId ?? "") === currentId ||
              String(p.userId ?? "") === currentId ||
              String(p.id ?? "") === currentId

            return (
              <ParticipantItem
                key={p.accountId ?? p.id ?? p.userId}
                participant={p}
                isMe={isMe}
                stream={p.stream}
                localMicOn={micOn}
                localCameraOn={cameraOn}
              />
            )
          })}
        </List>
      </Box>
    </Box>
  )
}

export default ParticipantList
