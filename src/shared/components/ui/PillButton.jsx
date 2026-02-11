import React from "react"
import { Button, CircularProgress } from "@mui/material"
import { colors } from "@/shared/utils/colors"

const PillButton = ({
  children,
  onClick,
  variant = "contained",
  color = "primary", // can be 'primary' (red) or 'inherit' (gray/text)
  startIcon,
  endIcon,
  disabled = false,
  loading = false,
  fullWidth = false,
  sx = {},
  ...props
}) => {
  const isRed = variant === "contained" && color === "primary"

  const baseSx = {
    borderRadius: "50px",
    textTransform: "uppercase",
    boxShadow: "none",
    padding: "8px 24px",
    ...(isRed && {
      backgroundColor: colors.red[700],
      color: "#fff",
      "&:hover": {
        backgroundColor: colors.red[800],
        boxShadow: "none",
      },
    }),
    ...sx,
  }

  return (
    <Button
      variant={variant}
      color={color === "primary" ? "primary" : color} // Pass valid MUI color string if not 'primary' mapped to our red
      onClick={onClick}
      startIcon={startIcon}
      endIcon={endIcon}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      sx={baseSx}
      {...props}
    >
      {loading ? <CircularProgress size={24} color="inherit" /> : children}
    </Button>
  )
}

export default PillButton
