import React, { useState } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import {
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material"
import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"
import { useLanguage } from "@/shared/context/LanguageContext"
import { useActiveLink } from "../../hooks/useActiveLink"
import { LANGUAGE_CONFIG } from "../../config/languages"
import MobileLanguageItem from "./MobileLanguageItem"

const MobileCommunityDropdown = ({ navKey, onClose }) => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { lang } = useParams()
  const currentLang = lang || localStorage.getItem("communityLanguage") || "en"
  const [communityOpen, setCommunityOpen] = useState(false)
  const isActive = useActiveLink(navKey)

  const handleCommunityClick = (langKey) => {
    const location = window.location
    const pathWithoutLang = location.pathname.replace(/^\/(en|zh|vi)/, "")

    localStorage.setItem("communityLanguage", langKey)

    if (
      pathWithoutLang.startsWith("/community") ||
      pathWithoutLang.startsWith("/cat-speak")
    ) {
      navigate(`/${langKey}${pathWithoutLang}`)
    } else {
      navigate(`/${langKey}/community`)
    }
    onClose()
  }

  const handleExpandClick = () => {
    setCommunityOpen(!communityOpen)
  }

  return (
    <React.Fragment>
      <ListItemButton
        onClick={handleExpandClick}
        sx={{
          borderRadius: 3,
          py: 1.5,
          mb: 0.5,
          color: isActive || communityOpen ? "#990011" : "text.primary",
          backgroundColor:
            isActive || communityOpen
              ? "rgba(153, 0, 17, 0.05)"
              : "transparent",
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
        {communityOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={communityOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ pl: 2 }}>
          <Box
            sx={{
              borderLeft: "2px solid",
              borderColor: "divider",
              pl: 1,
              mt: 0.5,
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
            }}
          >
            {LANGUAGE_CONFIG.map((config) => (
              <MobileLanguageItem
                key={config.code}
                {...config}
                label={
                  t.header?.countries?.[config.labelKey] || config.fallbackLabel
                }
                soonLabel={t.header?.soon || "Soon"}
                isActive={currentLang === config.code && isActive}
                onSelect={handleCommunityClick}
              />
            ))}
          </Box>
        </List>
      </Collapse>
    </React.Fragment>
  )
}

export default MobileCommunityDropdown
