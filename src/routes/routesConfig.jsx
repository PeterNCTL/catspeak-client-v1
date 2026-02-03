import { AdminLayout, MainLayout, UserLayout, VideoCallLayout } from "@layouts"
import { PageNotFound, ForbiddenPage } from "@pages/ErrorPage"
import {
  LandingPage,
  PolicyPage,
  HomePage,
  VideoCallRoom,
  RoomDetailPage,
  QueuePage,
  ComingSoonPage,
  RoomsPage,
  // CatSpeakPage, // Deprecated in route config, replaced by NewsPage etc.
  NewsPage,
  DiscoverPage,
  VideoPage,
  MailPage,
  CatSpeakLayout,
  VerifyEmailPage,
} from "@pages/Guest"
import { UserDashboard, UserProfile, UserSetting } from "@pages/User"
import { AdminPage } from "@pages/Admin"

import { Navigate } from "react-router-dom"
import useAuth from "@hooks/useAuth"
import AuthGuard from "@components/Guards/AuthGuard"
import GuestGuard from "@components/Guards/GuestGuard"

const RootRoute = () => {
  const { isAuthenticated, user } = useAuth()

  if (isAuthenticated && user?.roleName === "Admin") {
    return <Navigate to="/admin" replace />
  }

  return <LandingPage />
}

const routesConfig = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <RootRoute />,
      },
      {
        path: "community",
        element: <RoomsPage />,
      },
      {
        path: "cat-speak",
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

      {
        path: "reset-password",
        element: <HomePage />,
      },

      {
        path: "verify-email",
        element: <VerifyEmailPage />,
      },
    ],
  },
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
        element: <UserSetting />,
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
