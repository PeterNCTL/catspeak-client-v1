import React from "react"
import { Box, Typography, Stack, Chip } from "@mui/material"
import { colors } from "@/shared/utils/colors"

const LevelSelector = ({ selectedLevel, onSelect, levels, t }) => {
  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography
        display="block"
        gutterBottom
        sx={{ fontWeight: 700, fontSize: "0.875rem" }}
      >
        {t.rooms.createRoom.requiredLevel}
      </Typography>
      <Stack
        direction="row"
        spacing={1}
        justifyContent="center"
        flexWrap="wrap"
        useFlexGap
        sx={{ gap: 1 }}
      >
        {levels?.map((level) => {
          const isSelected = selectedLevel === level
          return (
            <Chip
              key={level}
              label={level}
              onClick={() => onSelect(isSelected ? "" : level)}
              variant={isSelected ? "filled" : "outlined"}
              clickable
              sx={{
                backgroundColor: isSelected ? colors.red[700] : "transparent",
                color: isSelected ? "#fff" : "default",
                borderColor: isSelected ? "transparent" : undefined,
                "&:hover": {
                  backgroundColor: isSelected
                    ? colors.red[800]
                    : "rgba(0, 0, 0, 0.04)",
                },
                "&.MuiChip-filledPrimitive": {
                  backgroundColor: isSelected ? colors.red[700] : undefined,
                },
              }}
            />
          )
        })}
      </Stack>
    </Box>
  )
}

export default LevelSelector
