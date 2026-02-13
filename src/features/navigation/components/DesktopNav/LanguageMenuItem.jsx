import React from "react"
import { MenuItem, ListItemIcon, Stack, Typography, Chip } from "@mui/material"

const LanguageMenuItem = ({
  code,
  label,
  flag,
  disabled,
  onSelect,
  soonLabel,
}) => (
  <MenuItem
    disabled={disabled}
    onClick={disabled ? (e) => e.preventDefault() : () => onSelect(code, label)}
    sx={{ height: 40, opacity: 1 }}
  >
    <ListItemIcon>
      <img
        src={flag}
        alt={label}
        className={`w-6 h-6 rounded-full object-cover ${
          disabled ? "grayscale opacity-50" : ""
        }`}
        style={{ width: 24, height: 24 }}
      />
    </ListItemIcon>
    {disabled ? (
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
      >
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Chip
          label={soonLabel}
          size="small"
          sx={{
            ml: 1,
            height: 20,
            fontSize: "0.65rem",
            fontWeight: "bold",
            opacity: 0.7,
          }}
        />
      </Stack>
    ) : (
      <Typography variant="body2">{label}</Typography>
    )}
  </MenuItem>
)

export default LanguageMenuItem
