import { useState } from "react"
import { Layout, theme } from "antd"
import { Outlet, ScrollRestoration } from "react-router-dom"
import HeaderBar from "../MainLayout/HeaderBar"
import Footer from "../MainLayout/Footer"
import Auth from "@/features/auth/components"
import { MessageWidget } from "@/features/messages"

const { Content } = Layout

const UserLayout = () => {
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    mode: "login",
  })

  const openAuthModal = (mode = "login") =>
    setAuthModal({
      isOpen: true,
      mode,
    })

  const closeAuthModal = () =>
    setAuthModal((prev) => ({
      ...prev,
      isOpen: false,
    }))

  const {
    token: { colorBgContainer },
  } = theme.useToken()

  return (
    <Layout className="flex justify-center bg-white">
      {/* Header full width */}
      <HeaderBar onGetStarted={() => openAuthModal("login")} />

      <Content className="w-full flex justify-center">
        <Outlet />
      </Content>

      {/* Footer full width */}
      <Footer />

      <Auth
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onClose={closeAuthModal}
        onSwitchMode={openAuthModal}
      />

      {/* Floating message bubble */}
      <MessageWidget />

      <ScrollRestoration />
    </Layout>
  )
}

export default UserLayout
