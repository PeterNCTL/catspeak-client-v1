import React, { useState } from "react"
import { NavLink, useNavigate, useSearchParams } from "react-router-dom"
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Stack,
  Drawer,
  Typography,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import { Menu as MenuIcon, ExpandLess, ExpandMore } from "@mui/icons-material"
import { VietNam, China, USA } from "@assets/icons/flags"
import HeaderLogo from "./Header/HeaderLogo"
import HeaderNav, { navLinks } from "./Header/HeaderNav"
import HeaderUserControls from "./Header/HeaderUserControls"
import HeaderGuestControls from "./Header/HeaderGuestControls"
import LanguageSwitcher from "@/components/common/LanguageSwitcher"
import { useLanguage } from "@/context/LanguageContext"
import useAuth from "@/hooks/useAuth"

const HeaderBar = ({ onGetStarted }) => {
  const { isAuthenticated: isLoggedIn } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          px: { xs: 2, md: 4 }, // Match previous padding: px-8 py-5 max-md:px-4 (approx)
          py: 1.5, // Approx 5 * 4px = 20px, py-5 was likely 1.25rem
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        {/* Left Section: Burger (Mobile) + Logo */}
        <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { lg: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            {/* Logo with fixed width to prevent shrinking */}
            <Box
              sx={{
                flexShrink: 0,
                width: "160px", // Fixed width
                display: "flex",
                alignItems: "center",
              }}
            >
              <HeaderLogo />
            </Box>
          </Stack>
        </Box>

        {/* Center Section: Desktop Nav */}
        <Box sx={{ display: { xs: "none", lg: "block" } }}>
          <HeaderNav />
        </Box>

        {/* Right Section: Controls */}
        <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={{ xs: 1.5, sm: 2 }}
          >
            <Box sx={{ display: { xs: "none", lg: "block" } }}>
              <LanguageSwitcher />
            </Box>
            {isLoggedIn ? (
              <HeaderUserControls />
            ) : (
              <HeaderGuestControls onGetStarted={onGetStarted} />
            )}
          </Stack>
        </Box>
      </Toolbar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 300 },
        }}
      >
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Mobile Language Switcher */}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <LanguageSwitcher />
          </Box>
          <Box component="nav">
            <MobileNavLinks onClose={handleDrawerToggle} />
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  )
}

const MobileNavLinks = ({ onClose }) => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [communityOpen, setCommunityOpen] = useState(false)

  // Sub-menu items for Community
  const communityItems = [
    { key: "vietnamese", label: t.home.countries.vietnam, icon: VietNam },
    { key: "chinese", label: t.home.countries.china, icon: China },
    { key: "english", label: t.home.countries.usa, icon: USA },
  ]

  const handleCommunityClick = (langKey) => {
    navigate(`/community?language=${langKey}`)
    onClose()
  }

  const handleExpandClick = () => {
    setCommunityOpen(!communityOpen)
  }

  return (
    <List component="div" disablePadding>
      {navLinks.map(({ key, href, hasDropdown }) => {
        const lang = searchParams.get("language")
        const finalHref = lang ? `${href}?language=${lang}` : href

        if (hasDropdown && key === "community") {
          return (
            <React.Fragment key={key}>
              <ListItemButton
                onClick={handleExpandClick}
                sx={{
                  borderRadius: 3,
                  py: 1.5,
                  mb: 0.5,
                  color: communityOpen ? "#990011" : "text.primary",
                  backgroundColor: communityOpen
                    ? "rgba(153, 0, 17, 0.05)"
                    : "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <ListItemText
                  primary={t.nav[key]}
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
                    {communityItems.map((item) => {
                      const isVietnamese = item.key === "vietnamese"
                      return (
                        <ListItemButton
                          key={item.key}
                          disabled={isVietnamese}
                          onClick={() => {
                            if (!isVietnamese) handleCommunityClick(item.key)
                          }}
                          sx={{
                            borderRadius: 2,
                            py: 1,
                            backgroundColor: isVietnamese
                              ? "action.hover"
                              : "transparent",
                            opacity: isVietnamese ? 0.6 : 1,
                            "&:hover": {
                              backgroundColor: isVietnamese
                                ? "action.hover"
                                : "rgba(0,0,0,0.04)",
                            },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <img
                              src={item.icon}
                              alt={item.label}
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: "50%",
                                objectFit: "cover",
                                filter: isVietnamese
                                  ? "grayscale(100%)"
                                  : "none",
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={item.label}
                            primaryTypographyProps={{
                              variant: "body2",
                            }}
                          />
                          {isVietnamese && (
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
                              {t.header.soon}
                            </Box>
                          )}
                        </ListItemButton>
                      )
                    })}
                  </Box>
                </List>
              </Collapse>
            </React.Fragment>
          )
        }

        return (
          <ListItemButton
            key={key}
            component={NavLink}
            to={finalHref}
            onClick={onClose}
            sx={{
              borderRadius: 3,
              py: 1.5,
              mb: 0.5,
              color: "text.secondary",
              "&.active": {
                color: "#990011",
                backgroundColor: "rgba(153, 0, 17, 0.1)",
              },
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <ListItemText
              primary={t.nav[key]}
              primaryTypographyProps={{
                fontWeight: 600,
              }}
            />
          </ListItemButton>
        )
      })}
    </List>
  )
}

export default HeaderBar
