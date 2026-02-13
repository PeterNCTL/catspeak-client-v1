import React from "react"
import { Drawer, Box } from "@mui/material"
import LanguageSwitcher from "@/shared/components/common/LanguageSwitcher"
import MobileNavLinks from "./MobileNavLinks"

const MobileDrawer = ({ open, onClose }) => {
  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
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
          <MobileNavLinks onClose={onClose} />
        </Box>
      </Box>
    </Drawer>
  )
}

export default MobileDrawer
