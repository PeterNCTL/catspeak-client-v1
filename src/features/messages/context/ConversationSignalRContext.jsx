import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react"
import * as signalR from "@microsoft/signalr"
import { useAuth } from "@/features/auth"

const ConversationSignalRContext = createContext(null)

export const useConversationSignalRContext = () => {
  return useContext(ConversationSignalRContext)
}

export const ConversationSignalRProvider = ({ children }) => {
  const { token } = useAuth()
  const [isConnected, setIsConnected] = useState(false)
  const [connectionId, setConnectionId] = useState(null)
  const connectionRef = useRef(null)

  // We need to keep track of subscribers
  // Map<EventName, Set<Callback>>
  const subscribersRef = useRef(new Map())

  // Subscribe method
  const on = useCallback((eventName, callback) => {
    if (!subscribersRef.current.has(eventName)) {
      subscribersRef.current.set(eventName, new Set())
    }
    subscribersRef.current.get(eventName).add(callback)

    // Return unsubscribe function
    return () => {
      const callbacks = subscribersRef.current.get(eventName)
      if (callbacks) {
        callbacks.delete(callback)
      }
    }
  }, [])

  const off = useCallback((eventName, callback) => {
    const callbacks = subscribersRef.current.get(eventName)
    if (callbacks) {
      callbacks.delete(callback)
    }
  }, [])

  // Helper to notify subscribers
  const notifySubscribers = useCallback((eventName, ...args) => {
    const callbacks = subscribersRef.current.get(eventName)
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(...args)
        } catch (err) {
          console.error(
            `[ConversationSignalR] Error in handler for ${eventName}:`,
            err,
          )
        }
      })
    }
  }, [])

  useEffect(() => {
    if (!token) {
      return
    }

    const apiUrl = import.meta.env.VITE_API_BASE_URL
    const baseUrl = apiUrl.replace(/\/api\/?$/, "")
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

    // Bind server events to notify subscribers
    const events = [
      "NewMessage",
      "NewConversation",
      "FriendStatusChange",
      "ChatUpdated",
    ]
    events.forEach((event) => {
      newConnection.on(event, (...args) => notifySubscribers(event, ...args))
    })

    const start = async () => {
      try {
        await newConnection.start()
        console.log(
          "[ConversationSignalR] Connected, ID:",
          newConnection.connectionId,
        )
        setIsConnected(true)
        setConnectionId(newConnection.connectionId)
        notifySubscribers("OnConnected", newConnection)
      } catch (err) {
        // Ignore errors if the connection was stopped intentionally during negotiation
        const errorMessage = err.toString()
        if (
          !errorMessage.includes("AbortError") &&
          !errorMessage.includes(
            "The connection was stopped during negotiation",
          )
        ) {
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
      notifySubscribers("OnReconnected", id)
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
  }, [token, notifySubscribers])

  const invoke = useCallback(async (methodName, ...args) => {
    if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
      return await connectionRef.current.invoke(methodName, ...args)
    }
    return Promise.reject("SignalR not connected")
  }, [])

  const sendMessage = useCallback(
    (conversationId, messageContent, messageType = 0) => {
      return invoke("SendMessage", {
        conversationId,
        messageContent,
        messageType,
      })
    },
    [invoke],
  )

  const value = {
    isConnected,
    connectionId,
    sendMessage,
    invoke,
    on,
    off,
  }

  return (
    <ConversationSignalRContext.Provider value={value}>
      {children}
    </ConversationSignalRContext.Provider>
  )
}
