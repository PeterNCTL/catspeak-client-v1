import MicOffIcon from "@mui/icons-material/MicOff"
import VideocamOffIcon from "@mui/icons-material/VideocamOff"
import { Box, Avatar, Typography } from "@mui/material"
import useAudioLevel from "../../hooks/useAudioLevel"
import { useEffect, useRef, useMemo } from "react"
import { useParticipant } from "@videosdk.live/react-sdk"

const VideoTile = ({
  participantId, // New prop
  stream: propStream,
  name: propName,
  avatar: propAvatar,
  isLocal: propIsLocal,
  micOn: propMicOn = true,
  videoOn: propVideoOn = true,
}) => {
  // -- VideoSDK Hook --
  // If participantId is provided, we use the hook to get reactive state/streams
  const {
    displayName,
    webcamStream,
    micStream,
    webcamOn,
    micOn: sdkMicOn,
    isLocal: sdkIsLocal,
  } = useParticipant(participantId || null)

  // -- Derived State --
  // Prefer SDK values if available (participantId exists), otherwise fallback to props
  const useSdk = !!participantId

  const name = useSdk ? displayName : propName
  const isLocal = useSdk ? sdkIsLocal : propIsLocal
  const micOn = useSdk ? sdkMicOn : propMicOn
  const videoOn = useSdk ? webcamOn : propVideoOn

  // Combine streams if using SDK
  const sdkStream = useMemo(() => {
    if (!useSdk) return null
    if (webcamStream || micStream) {
      const tracks = []
      if (webcamStream?.track) tracks.push(webcamStream.track)
      if (micStream?.track) tracks.push(micStream.track)
      return new MediaStream(tracks)
    }
    return null
  }, [webcamStream, micStream, useSdk])

  const stream = useSdk ? sdkStream : propStream

  // -- Existing Logic --
  const audioLevel = useAudioLevel(stream)
  const isSpeaking = micOn && audioLevel > 5
  const videoRef = useRef(null)

  // Check if stream actually has video tracks (Hardware check)
  const hasVideoTrack = stream && stream.getVideoTracks().length > 0
  const isVideoVisible = videoOn && hasVideoTrack

  useEffect(() => {
    // Assign stream if ref exists and stream exists (regardless of videoOn)
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  return (
    <Box
      sx={{
        position: "relative",
        height: "100%",
        width: "100%",
        overflow: "hidden",
        borderRadius: 2,
        bgcolor: "common.white",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: isSpeaking ? "success.main" : "divider",
        boxShadow: isSpeaking
          ? "0 0 15px rgba(46,125,50,0.4)"
          : "0 1px 3px rgba(15,23,42,0.08)",
        transition: "border-color 200ms ease, box-shadow 200ms ease",
      }}
    >
      {/* Always render video if stream exists to ensure audio plays, hide if videoOn is false */}
      {stream && (
        <Box
          component="video"
          autoPlay
          playsInline
          muted={isLocal}
          ref={videoRef}
          sx={{
            height: "100%",
            width: "100%",
            objectFit: "cover",
            display: isVideoVisible ? "block" : "none",
          }}
          onLoadedMetadata={() => {
            if (videoRef.current) {
              videoRef.current.play().catch(() => {})
            }
          }}
          onError={() => {
            // Silenced video error
          }}
        />
      )}

      {/* Show Avatar if no stream OR video is off */}
      {(!stream || !isVideoVisible) && (
        <Box
          sx={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {propAvatar ? (
            <Avatar
              src={propAvatar}
              alt={name}
              sx={{
                width: { xs: 64, sm: 80, md: 96 },
                height: { xs: 64, sm: 80, md: 96 },
                borderWidth: 4,
                borderStyle: "solid",
                borderColor: isSpeaking ? "success.main" : "grey.300",
                boxShadow: isSpeaking ? "0 0 15px rgba(46,125,50,0.4)" : "none",
              }}
              imgProps={{
                onError: (e) => {
                  // Hide if fails
                  e.target.style.display = "none"
                },
              }}
            />
          ) : (
            <Avatar
              sx={{
                width: { xs: 64, sm: 80, md: 96 },
                height: { xs: 64, sm: 80, md: 96 },
                bgcolor: "grey.200",
                color: "grey.600",
                borderWidth: 4,
                borderStyle: "solid",
                borderColor: isSpeaking ? "success.main" : "grey.300",
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              {(name || "?").charAt(0).toUpperCase()}
            </Avatar>
          )}
        </Box>
      )}

      {/* Overlay Info */}
      <Box
        sx={{
          position: "absolute",
          left: 12,
          bottom: 12,
          display: "flex",
          alignItems: "center",
          gap: 1,
          maxWidth: "70%", // leave room for status icons on small tiles
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: "text.primary",
            display: "flex",
            alignItems: "center",
            gap: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.875rem" },
          }}
        >
          {name} {isLocal && "(You)"}
        </Typography>

        {isSpeaking && (
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              gap: 0.25,
              height: 12,
            }}
          >
            <Box
              sx={{
                width: 3,
                bgcolor: "success.main",
                borderRadius: "999px",
                animation: "pulse 1s ease-in-out infinite",
                height: 8,
              }}
            />
            <Box
              sx={{
                width: 3,
                bgcolor: "success.main",
                borderRadius: "999px",
                animation: "pulse 1s ease-in-out infinite",
                animationDelay: "100ms",
                height: 12,
              }}
            />
            <Box
              sx={{
                width: 3,
                bgcolor: "success.main",
                borderRadius: "999px",
                animation: "pulse 1s ease-in-out infinite",
                animationDelay: "200ms",
                height: 6,
              }}
            />
          </Box>
        )}
      </Box>

      {/* Status Icons */}
      <Box
        sx={{
          position: "absolute",
          right: 12,
          bottom: 12,
          display: "flex",
          gap: 1,
          alignItems: "center",
        }}
      >
        {!micOn && <MicOffIcon sx={{ fontSize: 18, color: "error.light" }} />}
        {!videoOn && (
          <VideocamOffIcon sx={{ fontSize: 18, color: "error.light" }} />
        )}
      </Box>
    </Box>
  )
}

export default VideoTile
