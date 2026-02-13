import React, { useEffect, useState } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { Menu, Fade, Box } from "@mui/material"
import { FiChevronDown } from "react-icons/fi"
import { useLanguage } from "@/shared/context/LanguageContext"
import { useActiveLink } from "../../hooks/useActiveLink"
import { LANGUAGE_CONFIG } from "../../config/languages"
import LanguageMenuItem from "./LanguageMenuItem"

const DesktopCommunityDropdown = ({ navKey }) => {
  const { t } = useLanguage()
  const location = useLocation()
  const navigate = useNavigate()
  const { lang } = useParams()
  const [anchorEl, setAnchorEl] = useState(null)
  const isActive = useActiveLink(navKey)

  const isDropdownOpen = Boolean(anchorEl)

  // Helper to get label from config
  const getLabel = (code) => {
    const config = LANGUAGE_CONFIG.find((c) => c.code === code)
    return (
      t.header?.countries?.[config?.labelKey] || config?.fallbackLabel || "Anh"
    )
  }

  // Initialize label state
  const [selectedLabel, setSelectedLabel] = useState(() => {
    const savedLang = localStorage.getItem("communityLanguage")
    return getLabel(savedLang || "en")
  })

  // Sync label with URL param or localStorage
  useEffect(() => {
    const targetLang = lang || localStorage.getItem("communityLanguage") || "en"
    const label = getLabel(targetLang)
    setSelectedLabel(label)

    // Only update localStorage if lang comes from URL
    if (lang) {
      localStorage.setItem("communityLanguage", lang)
    }
  }, [lang, t])

  const handleLanguageSelect = (newLang, label) => {
    setSelectedLabel(label)
    setAnchorEl(null)

    const pathWithoutLang = location.pathname.replace(/^\/(en|zh|vi)/, "")

    // Determine if we should preserve the sub-path
    const shouldPreservePath =
      pathWithoutLang.startsWith("/community") ||
      pathWithoutLang.startsWith("/cat-speak")

    const targetPath = shouldPreservePath ? pathWithoutLang : "/community"
    navigate(`/${newLang}${targetPath}`)
  }

  const handleCommunityClick = () => {
    const currentLang =
      lang || localStorage.getItem("communityLanguage") || "en"
    navigate(`/${currentLang}/community`)
  }

  return (
    <React.Fragment>
      <Box
        sx={{
          display: "flex",
          flex: 1,
          whiteSpace: "nowrap",
          alignItems: "center",
          justifyContent: "center",
          py: 1.5, // 12px
          pl: 6, // 48px
          pr: 1, // 8px
          gap: 1, // 8px
          fontSize: "0.875rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.025em",
          borderRadius: "9999px",
          transition: "all 200ms",
          cursor: "pointer",
          userSelect: "none",
          color:
            isDropdownOpen || isActive ? "white" : "rgba(255, 255, 255, 0.7)",
          "&:hover": {
            color: "white",
            bgcolor: "transparent",
          },
        }}
      >
        <span
          onClick={handleCommunityClick}
          style={{ flex: 1, cursor: "pointer" }}
        >
          {selectedLabel || t.nav[navKey]}
        </span>
        <Box
          component="button"
          id="community-menu-button"
          onClick={(e) => {
            e.stopPropagation()
            setAnchorEl(e.currentTarget)
          }}
          aria-controls={isDropdownOpen ? "community-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={isDropdownOpen ? "true" : undefined}
          sx={{
            p: 1,
            borderRadius: "9999px",
            transition: "background-color 200ms",
            border: "none",
            background: "transparent",
            color: "inherit",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <FiChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isDropdownOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </Box>
      </Box>
      <Menu
        id="community-menu"
        anchorEl={anchorEl}
        open={isDropdownOpen}
        onClose={() => setAnchorEl(null)}
        TransitionComponent={Fade}
        MenuListProps={{
          "aria-labelledby": "community-menu-button",
          sx: { py: 1, minWidth: 200 },
          onMouseLeave: () => setAnchorEl(null),
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        slotProps={{
          paper: {
            elevation: 3,
            sx: {
              mt: 1,
              borderRadius: 2,
              overflow: "visible",
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: "50%",
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translate(50%, -50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
      >
        {LANGUAGE_CONFIG.map((config) => (
          <LanguageMenuItem
            key={config.code}
            {...config}
            label={
              t.header?.countries?.[config.labelKey] || config.fallbackLabel
            }
            soonLabel={t.header?.soon || "Soon"}
            onSelect={handleLanguageSelect}
          />
        ))}
      </Menu>
    </React.Fragment>
  )
}

export default DesktopCommunityDropdown
