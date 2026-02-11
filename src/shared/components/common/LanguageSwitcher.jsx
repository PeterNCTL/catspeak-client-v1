import React, { useState } from "react"
import { Menu, MenuItem, Typography, Box } from "@mui/material"
import { ExpandMore } from "@mui/icons-material"
import { useLanguage } from "@/shared/context/LanguageContext"
import colors from "@/shared/utils/colors"

const LanguageSwitcher = ({ className = "" }) => {
  const { language, setLanguage, t } = useLanguage()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLanguageSelect = (lang) => {
    setLanguage(lang)
    handleClose()
  }

  const getDisplayLabel = () => {
    switch (language) {
      case "vi":
        return t.header?.languages?.vi || "Vietnamese"
      case "zh":
        return t.header?.languages?.zh || "Chinese"
      case "en":
        return t.header?.languages?.en || "English"
      default:
        return t.header?.languages?.en || "English"
    }
  }

  return (
    <div className={className}>
      <Box
        onClick={handleClick}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          cursor: "pointer",
        }}
      >
        <Typography
          variant="h6" // Approximate text-lg
          sx={{
            fontWeight: "bold",
            color: "#FFB400",
            fontSize: "1.125rem", // text-lg
            lineHeight: "1.75rem",
            minWidth: "200px",
            whiteSpace: "nowrap",
            textAlign: "right",
          }}
        >
          {getDisplayLabel()}
        </Typography>
        <ExpandMore
          sx={{
            color: "#FFB400",
            fontSize: "1.25rem", // text-xl
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        disableScrollLock
        MenuListProps={{
          "aria-labelledby": "language-button",
        }}
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: 2,
            mt: 1,
            minWidth: 300,
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem
          onClick={() => handleLanguageSelect("vi")}
          sx={{
            height: 40,
            backgroundColor:
              language === "vi" ? colors.primary2 : "transparent",
            borderRadius: 1,
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <Typography variant="body2">
            {t.header?.languages?.vi || "Vietnamese"}
          </Typography>
        </MenuItem>
        <MenuItem
          disabled
          sx={{
            height: 40,
            borderRadius: 1,
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "text.disabled" }} // Removed fontWeight: 600
          >
            {t.header?.languages?.viNom || "Vietnamese (Nom) - Coming soon"}
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={() => handleLanguageSelect("zh")}
          sx={{
            height: 40,
            backgroundColor:
              language === "zh" ? colors.primary2 : "transparent",
            borderRadius: 1,
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "text.primary" }} // Removed fontWeight: 600
          >
            {t.header?.languages?.zh || "Chinese"}
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={() => handleLanguageSelect("en")}
          sx={{
            height: 40,
            backgroundColor:
              language === "en" ? colors.primary2 : "transparent",
            borderRadius: 1,
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "text.primary" }} // Removed fontWeight: 600
          >
            {t.header?.languages?.en || "English"}
          </Typography>
        </MenuItem>
      </Menu>
    </div>
  )
}

export default LanguageSwitcher
