import React, { useState, useRef, useEffect, useCallback } from "react"
import * as signalR from "@microsoft/signalr"
import useAuth from "@/hooks/useAuth"

/**
 * Hook to manage SignalR connection for Real-time Conversations
 *
 * handlers: {
 *   NewMessage: (message) => void,
 *   NewConversation: (conversation) => void,
 *   FriendStatusChange: (status) => void,
 *   ChatUpdated: (update) => void,
 *   OnConnected: (connection) => void,
 *   OnReconnected: (connectionId) => void
 * }
 */
export const useConversationSignalR = (handlers = {}) => {
  const { token } = useAuth()
  const [isConnected, setIsConnected] = useState(false)
  const [connectionId, setConnectionId] = useState(null)

  // Use ref for handlers to always access latest without re-running effect
  const handlersRef = useRef(handlers)
  useEffect(() => {
    handlersRef.current = handlers
  }, [handlers])

  const connectionRef = useRef(null)

  useEffect(() => {
    if (!token) {
      // console.warn("[ConversationSignalR] No token found.")
      return
    }

    const apiUrl = import.meta.env.VITE_API_BASE_URL
    const baseUrl = apiUrl.replace(/\/api\/?$/, "")
    // Assuming endpoint is /hubs/chat based on context,
    // or maybe /hubs/conversation. Trying /hubs/chat first.
    const hubUrl = `${baseUrl}/hubs/chat`

    console.log("[ConversationSignalR] Connecting to:", hubUrl)

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build()

    connectionRef.current = newConnection

    // Helper to safely call handlers
    const safeHandler =
      (name) =>
      (...args) => {
        // console.log(`[ConversationSignalR] Event: ${name}`, args)
        const handler = handlersRef.current[name]
        if (handler) {
          handler(...args)
        }
      }

    // Bind server-to-client events
    // public async Task NotifyNewMessageAsync(int conversationId, MessageDto message)
    newConnection.on("NewMessage", safeHandler("NewMessage"))

    // public async Task NotifyNewConversationAsync(int userId, ConversationDto conversation)
    newConnection.on("NewConversation", safeHandler("NewConversation"))

    // public async Task NotifyUserStatusChangeAsync(int userId, bool isOnline)
    newConnection.on("FriendStatusChange", safeHandler("FriendStatusChange"))

    // public async Task NotifyChatUpdatedAsync(int userId, string message)
    newConnection.on("ChatUpdated", safeHandler("ChatUpdated"))

    const start = async () => {
      try {
        await newConnection.start()
        console.log(
          "[ConversationSignalR] Connected, ID:",
          newConnection.connectionId,
        )
        setIsConnected(true)
        setConnectionId(newConnection.connectionId)

        if (handlersRef.current.OnConnected) {
          handlersRef.current.OnConnected(newConnection)
        }
      } catch (err) {
        if (!err.toString().includes("AbortError")) {
          console.error("[ConversationSignalR] Connection Error:", err)
        }
        setIsConnected(false)
      }
    }

    start()

    newConnection.onreconnecting(() => {
      console.warn("[ConversationSignalR] Reconnecting...")
    })

    newConnection.onreconnected((id) => {
      console.log("[ConversationSignalR] Reconnected. ID:", id)
      setIsConnected(true)
      setConnectionId(id)
      if (handlersRef.current.OnReconnected) {
        handlersRef.current.OnReconnected(id)
      }
    })

    newConnection.onclose(() => {
      console.warn("[ConversationSignalR] Disconnected")
      setIsConnected(false)
      setConnectionId(null)
    })

    return () => {
      newConnection.stop().catch(() => {})
      setIsConnected(false)
      setConnectionId(null)
      connectionRef.current = null
    }
  }, [token])

  // Invoke wrapper
  const invoke = useCallback(async (methodName, ...args) => {
    if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
      return await connectionRef.current.invoke(methodName, ...args)
    }
    return Promise.reject("SignalR not connected")
  }, [])

  // Public methods to interact with Hub
  const sendMessage = useCallback(
    (conversationId, messageContent, messageType = 0) => {
      // messageType: 0 = Text, 1 = Picture
      return invoke("SendMessage", {
        conversationId,
        messageContent,
        messageType,
      })
    },
    [invoke],
  )

  return {
    isConnected,
    connectionId,
    sendMessage,
    invoke,
  }
}

export default useConversationSignalR
