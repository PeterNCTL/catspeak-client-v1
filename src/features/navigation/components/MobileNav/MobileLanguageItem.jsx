import React from "react"
import {
  ListItemButton,
  ListItemIcon,
  Stack,
  ListItemText,
  Box,
} from "@mui/material"

const MobileLanguageItem = ({
  code,
  label,
  flag,
  disabled,
  onSelect,
  soonLabel,
  isActive,
}) => {
  return (
    <ListItemButton
      disabled={disabled}
      onClick={disabled ? undefined : () => onSelect(code)}
      sx={{
        borderRadius: 2,
        py: 1,
        backgroundColor: isActive
          ? "rgba(153, 0, 17, 0.1)"
          : disabled
            ? "action.hover"
            : "transparent",
        color: isActive ? "#990011" : "text.primary",
        opacity: disabled ? 0.6 : 1,
        "&:hover": {
          backgroundColor: disabled ? "action.hover" : "rgba(0,0,0,0.04)",
        },
      }}
    >
      <ListItemIcon sx={{ minWidth: 32 }}>
        <img
          src={flag}
          alt={label}
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            objectFit: "cover",
            filter: disabled ? "grayscale(100%)" : "none",
          }}
        />
      </ListItemIcon>
      <ListItemText
        primary={label}
        primaryTypographyProps={{
          variant: "body2",
        }}
      />
      {disabled && (
        <Box
          component="span"
          sx={{
            fontSize: "0.625rem", // 10px
            fontWeight: "bold",
            color: "white",
            backgroundColor: "#9ca3af", // gray-400
            px: 0.75,
            py: 0.25,
            borderRadius: 999,
          }}
        >
          {soonLabel}
        </Box>
      )}
    </ListItemButton>
  )
}

export default MobileLanguageItem
