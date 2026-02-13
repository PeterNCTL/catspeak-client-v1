import React from "react"
import { NavLink, useParams } from "react-router-dom"
import { ListItemButton, ListItemText } from "@mui/material"
import { useLanguage } from "@/shared/context/LanguageContext"
import { useActiveLink } from "../../hooks/useActiveLink"

const MobileNavItem = ({ navKey, onClose }) => {
  const { t } = useLanguage()
  const { lang } = useParams()

  const currentLang = lang || localStorage.getItem("communityLanguage") || "en"

  let href
  if (navKey === "catSpeak") {
    href = `/${currentLang}/cat-speak/news`
  } else if (navKey === "cart") {
    href = "/cart"
  } else if (navKey === "connect") {
    href = "/connect"
  } else {
    href = "/"
  }

  const isActive = useActiveLink(navKey)

  return (
    <ListItemButton
      component={NavLink}
      to={href}
      onClick={onClose}
      sx={{
        borderRadius: 3,
        py: 1.5,
        mb: 0.5,
        color: isActive ? "#990011" : "text.secondary",
        backgroundColor: isActive ? "rgba(153, 0, 17, 0.1)" : "transparent",
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.04)",
        },
      }}
    >
      <ListItemText
        primary={t.nav[navKey]}
        primaryTypographyProps={{
          fontWeight: 600,
        }}
      />
    </ListItemButton>
  )
}

export default MobileNavItem
