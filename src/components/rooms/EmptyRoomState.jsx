import React from "react"
import { Box, Typography } from "@mui/material"

const EmptyRoomState = ({ message, height = "h-32" }) => {
  return (
    <Box
      className={`flex ${height} w-full flex-col items-center justify-center rounded-[20px] bg-white`}
      sx={{
        border: 1,
        borderColor: "divider",
      }}
    >
      <Typography variant="body2" color="textSecondary">
        {message}
      </Typography>
    </Box>
  )
}

export default EmptyRoomState
