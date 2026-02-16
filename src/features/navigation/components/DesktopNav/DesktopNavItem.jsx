import React from "react"
import { NavLink, useParams } from "react-router-dom"
import { Box } from "@mui/material"
import { useLanguage } from "@/shared/context/LanguageContext"
import { useActiveLink } from "../../hooks/useActiveLink"

const DesktopNavItem = ({ navKey, noActive }) => {
  const { t } = useLanguage()
  const { lang } = useParams()

  // Determine href based on key
  let href
  if (navKey === "catSpeak") {
    const currentLang =
      lang || localStorage.getItem("communityLanguage") || "zh"
    href = `/${currentLang}/cat-speak/news`
  } else if (navKey === "cart") {
    href = "/cart"
  } else if (navKey === "connect") {
    href = "/connect"
  } else {
    // Default fallback
    href = "/"
  }

  // Active state check
  const isActive = useActiveLink(navKey)

  return (
    <Box
      component={NavLink}
      to={href}
      sx={{
        display: "flex",
        flex: 1,
        whiteSpace: "nowrap",
        alignItems: "center",
        justifyContent: "center",
        py: 1.5, // 12px
        px: 6, // 48px
        gap: 1, // 8px
        fontSize: "0.875rem",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.025em",
        borderRadius: "9999px",
        transition: "all 200ms",
        textDecoration: "none",
        color: noActive
          ? "rgba(255, 255, 255, 0.7)"
          : isActive
            ? "white"
            : "rgba(255, 255, 255, 0.7)",
        "&:hover": {
          color: "white",
          bgcolor: "transparent",
        },
      }}
    >
      {t.nav[navKey]}
    </Box>
  )
}

export default DesktopNavItem
