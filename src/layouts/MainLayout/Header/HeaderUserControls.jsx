import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Menu,
  MenuItem,
  Avatar,
  CircularProgress,
  Divider,
  IconButton,
  ListItemIcon,
  Typography,
  Box,
  Stack,
  Chip,
} from "@mui/material"
import {
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material"
import { useGetProfileQuery } from "@/store/api/authApi"
import useAuth from "@/hooks/useAuth"
import { useLanguage } from "@/context/LanguageContext"

const HeaderUserControls = () => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { logout, user: authUser } = useAuth()
  const { data: userData, isLoading } = useGetProfileQuery()
  const [anchorEl, setAnchorEl] = useState(null)

  const user = userData?.data ?? authUser ?? {}
  const open = Boolean(anchorEl)

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    handleMenuClose()
    navigate("/")
  }

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U"
  }

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      {/* Notification Bell */}
      <IconButton color="inherit">
        <NotificationsIcon />
      </IconButton>

      {/* Avatar / Profile Trigger */}
      <IconButton
        onClick={handleMenuOpen}
        aria-controls={open ? "account-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        {isLoading ? (
          <CircularProgress size={32} color="inherit" />
        ) : (
          <Avatar
            src={user?.avatarImageUrl}
            alt={user?.username}
            sx={{ width: 32, height: 32 }}
          >
            {getInitials(user?.fullName || user?.username)}
          </Avatar>
        )}
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        disableScrollLock
      >
        <Box sx={{ pt: 1, px: 2, pb: 2, width: 300 }}>
          <Typography variant="body1" noWrap>
            {user?.username}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {user?.email}
          </Typography>
        </Box>

        <Divider />

        <MenuItem sx={{ height: 40 }} disabled>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
          >
            <Typography variant="body2">{t.header.settings}</Typography>
            <Chip
              label={t.header.soon}
              size="small"
              sx={{
                ml: 1,
                height: 20,
                fontSize: "0.65rem",
                fontWeight: "bold",
              }}
            />
          </Stack>
        </MenuItem>

        <MenuItem onClick={handleLogout} sx={{ height: 40 }}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>

          <Typography variant="body2">{t.header.logout}</Typography>
        </MenuItem>
      </Menu>
    </Stack>
  )
}

export default HeaderUserControls
