import React, { useState, useEffect } from "react"
import { Drawer, Button, Box, Typography, IconButton } from "@mui/material"
import { useNavigate, useLocation } from "react-router-dom"
import {
  FiMenu,
  FiX,
  FiLayout,
  FiGlobe,
  FiVideo,
  FiMail,
  FiSettings,
  FiFlag,
  FiHelpCircle,
  FiMessageSquare,
} from "react-icons/fi"
import { useLanguage } from "@/context/LanguageContext"
import InDevelopmentModal from "@/components/common/InDevelopmentModal"

const CatSpeakSidebar = () => {
  const { t } = useLanguage()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [devModalOpen, setDevModalOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Determine active key based on current path
  const getActiveKey = () => {
    const path = location.pathname.split("/").pop()
    if (path === "cat-speak") return "news" // Default
    return path
  }

  const [activeKey, setActiveKey] = useState(getActiveKey())

  useEffect(() => {
    setActiveKey(getActiveKey())
  }, [location.pathname])

  const menuItems = [
    { key: "news", label: t.catSpeak.sidebar.news, icon: FiLayout },
    { key: "discover", label: t.catSpeak.sidebar.discover, icon: FiGlobe },
    { key: "video", label: t.catSpeak.sidebar.video, icon: FiVideo },
    { key: "mail", label: t.catSpeak.sidebar.mail, icon: FiMail },
  ]

  const bottomItems = [
    {
      key: "settings",
      label: t.catSpeak.sidebar.settings,
      icon: FiSettings,
    },
    { key: "report", label: t.catSpeak.sidebar.report, icon: FiFlag },
    { key: "help", label: t.catSpeak.sidebar.help, icon: FiHelpCircle },
    {
      key: "feedback",
      label: t.catSpeak.sidebar.feedback,
      icon: FiMessageSquare,
    },
  ]

  const handleItemClick = (item) => {
    // Check if item belongs to bottomItems
    const isBottomItem = bottomItems.find((i) => i.key === item.key)
    if (isBottomItem) {
      setDevModalOpen(true)
      setMobileOpen(false)
      return
    }

    if (item.path) {
      navigate(item.path)
    } else if (menuItems.find((i) => i.key === item.key)) {
      navigate(`/cat-speak/${item.key}`)
    }
    setMobileOpen(false)
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col py-4">
      <div className="flex flex-col space-y-1">
        {menuItems.map((item) => (
          <MenuItem
            key={item.key}
            item={item}
            isActive={activeKey === item.key}
            onClick={() => handleItemClick(item)}
          />
        ))}
      </div>

      <div className="my-4 h-px w-full bg-gray-100" />

      <div className="flex flex-col space-y-1">
        {bottomItems.map((item) => (
          <MenuItem
            key={item.key}
            item={item}
            isActive={activeKey === item.key}
            onClick={() => handleItemClick(item)}
          />
        ))}
      </div>
    </div>
  )

  const MenuItem = ({ item, isActive, onClick }) => {
    const Icon = item.icon
    return (
      <button
        onClick={onClick}
        className={`flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors ${
          isActive
            ? "bg-gray-100 text-[#990011]"
            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
        } rounded-xl`}
      >
        <Icon size={20} />
        <span>{item.label}</span>
      </button>
    )
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-[240px] shrink-0">
        <div className="sticky top-24">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Trigger */}
      <div className="lg:hidden mb-4">
        <Button
          startIcon={<FiMenu />}
          onClick={() => setMobileOpen(true)}
          variant="outlined"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            textTransform: "none",
            borderRadius: "8px",
            borderColor: "#d9d9d9",
            color: "inherit",
            "&:hover": {
              borderColor: "#990011",
              color: "#990011",
            },
          }}
        >
          {t.catSpeak.sidebar.menu}
        </Button>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: { width: 280, padding: "10px", borderRadius: "0 16px 16px 0" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            px: 1,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            {t.catSpeak.sidebar.menu}
          </Typography>
          <IconButton onClick={() => setMobileOpen(false)}>
            <FiX />
          </IconButton>
        </Box>
        <SidebarContent />
      </Drawer>

      <InDevelopmentModal
        open={devModalOpen}
        onCancel={() => setDevModalOpen(false)}
      />
    </>
  )
}

export default CatSpeakSidebar
