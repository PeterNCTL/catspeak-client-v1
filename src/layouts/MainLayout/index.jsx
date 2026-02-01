import { useState, useEffect } from "react"
import { Layout, theme } from "antd"
import {
  Outlet,
  useLocation,
  useSearchParams,
  ScrollRestoration,
} from "react-router-dom"
import HeaderBar from "./HeaderBar"
import Footer from "./Footer"
import Auth from "@components/Auth"
import MessageWidget from "@/components/messages/MessageWidget"
import AuthModalContext from "@/context/AuthModalContext"

const { Content } = Layout

const MainLayout = () => {
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    mode: "login",
  })

  const location = useLocation()
  const [searchParams] = useSearchParams()

  // Check for reset password intent
  useEffect(() => {
    // If we are on the reset-password route OR we have parameters indicating a reset
    if (location.pathname === "/reset-password") {
      // Assuming parameters are passed in query string: ?token=...&email=...
      setAuthModal({
        isOpen: true,
        mode: "reset-password",
      })
    }
    // Alternatively, check for "mode" param in query string if backend link is like /?mode=reset
    else if (searchParams.get("mode") === "resetPassword") {
      setAuthModal({
        isOpen: true,
        mode: "reset-password",
      })
    }
  }, [location.pathname, searchParams])

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
    <AuthModalContext.Provider value={{ openAuthModal, closeAuthModal }}>
      <Layout className="flex justify-center bg-white">
        {/* Header full width */}
        <HeaderBar onGetStarted={() => openAuthModal("login")} />

        <Content className="w-full flex justify-center">
          <Outlet />
        </Content>

        {/* Footer full width (bên trong tự giới hạn 1200px) */}
        <Footer />

        <Auth
          isOpen={authModal.isOpen}
          mode={authModal.mode}
          onClose={closeAuthModal}
          onSwitchMode={openAuthModal}
        />

        {/* Floating message bubble, hiển thị trên mọi trang */}
        <MessageWidget />

        <ScrollRestoration />
      </Layout>
    </AuthModalContext.Provider>
  )
}

export default MainLayout
