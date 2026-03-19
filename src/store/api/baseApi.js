import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { setCredentials, logout } from "../slices/authSlice"

// Base API configuration
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || "/api",
  prepareHeaders: (headers, { getState }) => {
    // Get token from state if available, otherwise check localStorage
    // Get token from state if available, otherwise check localStorage
    const token = getState().auth.token
    if (token) {
      headers.set("authorization", `Bearer ${token}`)
    }
    return headers
  },
})

// Mutex lock for refresh
let refreshPromise = null

// Custom base query with auto-refresh logic
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  // Normalize: args can be a plain string (e.g. query: () => "/conversations")
  // or an object with { url, method, body, ... }. Always extract url safely.
  const url = typeof args === "string" ? args : args?.url

  if (result.error?.status === 401) {
    console.warn("401 detected:", url)
  }

  if (result.error && result.error.status === 401) {
    // Never retry or refresh for auth endpoints themselves — return immediately
    // to avoid infinite loops or premature logouts
    if (url === "/Auth/refresh-token" || url === "/Auth/login") {
      return result
    }

    const state = api.getState().auth
    const token = state.token || localStorage.getItem("token")
    const refreshToken =
      state.refreshToken || localStorage.getItem("refreshToken")

    if (!refreshToken || !token) {
      api.dispatch(logout())
      localStorage.removeItem("token")
      localStorage.removeItem("refreshToken")
      return result
    }

    if (!refreshPromise) {
      refreshPromise = (async () => {
        try {
          const refreshResult = await baseQuery(
            {
              url: "/Auth/refresh-token",
              method: "POST",
              body: { token, refreshToken },
            },
            api,
            extraOptions,
          )

          if (refreshResult.error?.status === 401) {
            // Refresh token invalid → logout
            api.dispatch(logout())
            localStorage.removeItem("token")
            localStorage.removeItem("refreshToken")
            return false
          }

          if (refreshResult.data) {
            const { user } = api.getState().auth
            api.dispatch(
              setCredentials({
                ...refreshResult.data,
                user: refreshResult.data.user || user,
              }),
            )
            return true
          }
          return false
        } catch (err) {
          api.dispatch(logout())
          localStorage.removeItem("token")
          localStorage.removeItem("refreshToken")
          return false
        } finally {
          refreshPromise = null
        }
      })()
    }

    const success = await refreshPromise

    if (success) {
      result = await baseQuery(args, api, extraOptions)
    }
  }

  return result
}

// Base API slice
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "User",
    "VideoSessions",
    "Rooms",
    "Stories",
    "MyStories",
    "Conversations",
    "Messages",
    "Events",
    "Post",
  ], // Define tag types for cache invalidation
  endpoints: () => ({}),
})
