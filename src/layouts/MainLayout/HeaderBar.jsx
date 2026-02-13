import React, { useState } from "react"
import { AppBar, Toolbar, Box, IconButton, Stack } from "@mui/material"
import { Menu as MenuIcon } from "@mui/icons-material"
import HeaderLogo from "./Header/HeaderLogo"
import DesktopNav from "@/features/navigation/components/DesktopNav/DesktopNav"
import MobileDrawer from "@/features/navigation/components/MobileNav/MobileDrawer"
import HeaderUserControls from "./Header/HeaderUserControls"
import HeaderGuestControls from "./Header/HeaderGuestControls"
import LanguageSwitcher from "@/shared/components/common/LanguageSwitcher"
import { useAuth } from "@/features/auth"

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
          <DesktopNav />
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
      <MobileDrawer open={mobileOpen} onClose={handleDrawerToggle} />
    </AppBar>
  )
}

export default HeaderBar
