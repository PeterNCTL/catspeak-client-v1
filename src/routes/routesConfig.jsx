import { AdminLayout, MainLayout, UserLayout, VideoCallLayout } from "@layouts"
import { PageNotFound, ForbiddenPage } from "@/shared/pages"

// Guest Pages
import LandingPage from "@/features/landing/pages/LandingPage"
import PolicyPage from "@/features/auth/pages/PolicyPage"
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage"
import VerifyEmailPage from "@/features/auth/pages/VerifyEmailPage"
import VideoCallRoom from "@/features/video-call/pages/VideoCallRoom"
import QueuePage from "@/features/queue/pages/QueuePage"
import RoomsPage from "@/features/rooms/pages/RoomsPage"
import RoomDetailPage from "@/features/rooms/pages/RoomDetailPage"

// Cat Speak Feature Pages
import CatSpeakLayout from "@/features/cat-speak/pages/CatSpeakLayout"
import NewsPage from "@/features/news/pages/NewsPage"
import NewsDetailPage from "@/features/news/pages/NewsDetailPage"
import DiscoverPage from "@/features/discover/DiscoverPage"
import VideoPage from "@/features/video/VideoPage"
import MailPage from "@/features/mail/pages/MailPage"

// Shared Pages
import { ComingSoonPage } from "@/shared/pages"

// User & Admin Pages
import UserDashboard from "@/features/user/pages/UserDashboard"
import UserProfile from "@/features/user/pages/UserProfile"
import SettingsPage from "@/features/settings/pages/SettingsPage"
import { AdminPage } from "@/features/admin/pages/AdminPage"

// Language routing components
import LanguageLayout from "./LanguageLayout"

import { Navigate } from "react-router-dom"
import { useAuth } from "@/features/auth"
import { AuthGuard } from "@/shared/components"

const RootRoute = () => {
  const { isAuthenticated, user } = useAuth()

  if (isAuthenticated && user?.roleName === "Admin") {
    return <Navigate to="/admin" replace />
  }

  return <LandingPage />
}

const routesConfig = [
  // Main layout routes (no language prefix)
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <RootRoute />,
      },
      {
        path: "reset-password",
        element: <ResetPasswordPage />,
      },
      {
        path: "verify-email",
        element: <VerifyEmailPage />,
      },
    ],
  },

  // Language-prefixed community route
  {
    path: "/:lang/community",
    element: <LanguageLayout />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <RoomsPage />,
          },
        ],
      },
    ],
  },

  // Language-prefixed cat-speak routes
  {
    path: "/:lang/cat-speak",
    element: <LanguageLayout />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            element: <CatSpeakLayout />,
            children: [
              {
                index: true,
                element: <Navigate to="news" replace />,
              },
              {
                path: "news",
                element: <NewsPage />,
              },
              {
                path: "news/:id",
                element: <NewsDetailPage />,
              },
              {
                path: "discover",
                element: <DiscoverPage />,
              },
              {
                path: "video",
                element: <VideoPage />,
              },
              {
                path: "mail",
                element: <MailPage />,
              },
            ],
          },
        ],
      },
    ],
  },

  // Non-language routes
  {
    path: "/meet",
    element: <VideoCallLayout />,
    children: [
      {
        path: ":id",
        element: (
          <AuthGuard>
            <VideoCallRoom />
          </AuthGuard>
        ),
      },
    ],
  },
  {
    path: "/room/:id",
    element: <RoomDetailPage />,
  },
  {
    path: "/policy",
    element: <PolicyPage />,
  },
  {
    path: "/app",
    element: (
      <AuthGuard>
        <UserLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <UserDashboard />,
      },
      {
        path: "setting",
        element: <SettingsPage />,
      },
      {
        path: "profile",
        element: <UserProfile />,
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <AuthGuard allowedRoles={["Admin"]}>
        <AdminLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <AdminPage />,
      },
    ],
  },
  {
    path: "/queue",
    element: (
      <AuthGuard>
        <QueuePage />
      </AuthGuard>
    ),
  },
  {
    path: "/cart",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <ComingSoonPage />,
      },
    ],
  },
  {
    path: "/connect",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <ComingSoonPage />,
      },
    ],
  },
  {
    path: "/403",
    element: <ForbiddenPage />,
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]

export default routesConfig
