import React from "react"
import { Box, Typography, TextField } from "@mui/material"
import { colors } from "@/utils/colors"

const RoomNameInput = ({ value, onChange, t }) => {
  const inputColorSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "50px",
      "& fieldset": {
        borderColor: colors.border,
      },
      "&:hover fieldset": {
        borderColor: colors.red[700],
      },
      "&.Mui-focused fieldset": {
        borderColor: colors.red[700],
      },
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: colors.red[700],
    },
  }

  return (
    <Box>
      <Typography variant="overline" display="block" gutterBottom>
        {t.rooms.createRoom.nameLabel}
      </Typography>
      <TextField
        autoFocus
        id="name"
        placeholder={t.rooms.createRoom.namePlaceholder}
        type="text"
        fullWidth
        variant="outlined"
        value={value}
        onChange={onChange}
        sx={inputColorSx}
      />
    </Box>
  )
}

export default RoomNameInput
