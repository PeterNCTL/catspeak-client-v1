import React from "react"
import { Stack, AvatarGroup, Avatar, Typography } from "@mui/material"

const ParticipantList = ({ participants = [] }) => {
  if (participants.length === 0) {
    return (
      <Typography color="text.secondary">No one else is here yet</Typography>
    )
  }

  return (
    <Stack alignItems="center" spacing={1} mt={2}>
      <AvatarGroup
        max={5}
        sx={{
          "& .MuiAvatar-root": {
            width: { xs: 32, md: 40 },
            height: { xs: 32, md: 40 },
            fontSize: { xs: 12, md: 14 },
            border: "2px solid white",
          },
        }}
      >
        {participants.map((p) => (
          <Avatar
            key={p.participantId}
            alt={p.username}
            src={
              p.avatarImageUrl ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                p.username,
              )}&background=random`
            }
          />
        ))}
      </AvatarGroup>
      <Typography variant="body2" color="text.secondary">
        {participants.length} is here
      </Typography>
    </Stack>
  )
}

export default ParticipantList
