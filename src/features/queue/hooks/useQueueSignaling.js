import { useState, useRef, useEffect, useCallback } from "react"
import { HubConnectionBuilder, HubConnectionState, LogLevel } from "@microsoft/signalr"

import { useAuth } from "@/features/auth"

export const useQueueSignaling = (handlers = {}) => {
  const { token } = useAuth()
  const [isConnected, setIsConnected] = useState(false)
  const [connectionId, setConnectionId] = useState(null)
  const connectionRef = useRef(null)

  // Use ref for handlers to avoid effect dependency issues
  const handlersRef = useRef(handlers)
  useEffect(() => {
    handlersRef.current = handlers
  }, [handlers])

  useEffect(() => {
    if (!token) {
      console.warn("[QueueSignalR] No token found, cannot connect.")
      return
    }

    const apiUrl = import.meta.env.VITE_API_BASE_URL
    const baseUrl = apiUrl.replace(/\/api\/?$/, "")
    const hubUrl = `${baseUrl}/hubs/queue`

    const newConnection = new HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build()

    connectionRef.current = newConnection

    const safeHandler =
      (name) =>
      (...args) => {
        // console.log(`[QueueSignalR] Event Received: ${name}`, args)
        const handler = handlersRef.current[name]
        if (handler) {
          handler(...args)
        }
      }

    // Bind Hub Events
    const events = [
      "QueueJoined",
      "QueueLeft",
      "QueueStatus",
      "MatchFound",
      "QueueError",
    ]
    events.forEach((evt) => {
      newConnection.on(evt, safeHandler(evt))
    })

    const start = async () => {
      try {
        await newConnection.start()
        setIsConnected(true)
        setConnectionId(newConnection.connectionId)

        // Notify handler of connection if needed
        if (handlersRef.current.OnConnected) {
          handlersRef.current.OnConnected(newConnection)
        }
      } catch (err) {
        // Ignore AbortError in strict mode logs
        if (
          !err.toString().includes("AbortError") &&
          !err.toString().includes("negotiation")
        ) {
          console.error("[QueueSignalR] Connection Error:", err)
        }
        setIsConnected(false)
      }
    }

    start()

    newConnection.onreconnecting(() => {
      console.warn("[QueueSignalR] Reconnecting...")
    })

    newConnection.onreconnected((connectionId) => {
      setIsConnected(true)
      setConnectionId(connectionId)
      if (handlersRef.current.OnReconnected) {
        handlersRef.current.OnReconnected(connectionId)
      }
    })

    newConnection.onclose(() => {
      console.warn("[QueueSignalR] Disconnected")
      setIsConnected(false)
      setConnectionId(null)
    })

    return () => {
      // console.log("[QueueSignalR] Stopping connection...")
      newConnection.stop().catch(() => {})
      setIsConnected(false)
      setConnectionId(null)
      connectionRef.current = null
    }
  }, [token]) // run when token changes

  // Wrappers for specific hub methods - Stabilize with useCallback
  const invoke = useCallback(async (methodName, ...args) => {
    if (connectionRef.current?.state === HubConnectionState.Connected) {
      return await connectionRef.current.invoke(methodName, ...args)
    }
    console.warn("[QueueSignalR] Cannot invoke, not connected.")
    return Promise.reject("Not Connected")
  }, [])

  const joinQueue = useCallback(
    (preferences) => {
      console.log("[QueueSignalR] JoinQueue payload:", preferences)
      return invoke("JoinQueue", preferences)
    },
    [invoke],
  )
  const leaveQueue = useCallback(() => invoke("LeaveQueue"), [invoke])

  return {
    isConnected,
    connectionId,
    invoke,
    joinQueue,
    leaveQueue,
  }
}
