import React, { useState, useEffect } from "react"
import { Drawer, Button } from "antd"
import { useNavigate, useLocation } from "react-router-dom"
import {
  FiMenu,
  FiLayout,
  FiGlobe,
  FiVideo,
  FiMail,
  FiSettings,
  FiFlag,
  FiHelpCircle,
  FiMessageSquare,
} from "react-icons/fi"

const CatSpeakSidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
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
    { key: "news", label: "Bản tin của Cat", icon: FiLayout },
    { key: "discover", label: "Khám phá thế giới", icon: FiGlobe },
    { key: "video", label: "Video", icon: FiVideo },
    { key: "mail", label: "Thư", icon: FiMail },
  ]

  const bottomItems = [
    {
      key: "settings",
      label: "Cài đặt",
      icon: FiSettings,
      path: "/app/setting",
    }, // Example external path
    { key: "report", label: "Nhật ký báo cáo", icon: FiFlag },
    { key: "help", label: "Trợ giúp", icon: FiHelpCircle },
    { key: "feedback", label: "Gửi ý kiến phản hồi", icon: FiMessageSquare },
  ]

  const handleItemClick = (item) => {
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
          icon={<FiMenu />}
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2"
        >
          Menu
        </Button>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setMobileOpen(false)}
        open={mobileOpen}
        width={280}
        styles={{ body: { padding: "10px" } }}
      >
        <SidebarContent />
      </Drawer>
    </>
  )
}

export default CatSpeakSidebar
