import React from "react"
import { Navigate } from "react-router-dom"
import { ChevronRight } from "lucide-react"
import HeaderLogo from "@/layouts/MainLayout/Header/HeaderLogo"

import {
  VideoGrid,
  ParticipantList,
  ChatBox,
  ControlBar as VideoCallControlBar,
  useSessionTimer,
} from "@/features/video-call"
import { formatDate } from "@/shared/utils/dateFormatter"

import { useVideoCallContext } from "@/shared/context/video/VideoCallContext"
import { VideoCallProvider } from "@/shared/context/video/VideoCallProvider"

const VideoCallRoomContent = () => {
  const {
    id,
    location,
    micOn,
    cameraOn,
    showChat,
    setShowChat,
    showParticipants,
    setShowParticipants,
    hasJoined,
    setHasJoined,
    user,
    isLoadingUser,
    currentUserId,
    session,
    isLeaving,
    localStream,
    peers,
    activeParticipants,
    messages,
    isConnected,
    handleToggleMic,
    handleToggleCam,
    handleSendMessage,
    handleLeaveSession,
    handleCopyLink,
  } = useVideoCallContext()

  const { elapsedSeconds, formattedElapsed, formattedMax } =
    useSessionTimer(session)

  const isSidePanelOpen = showChat || showParticipants
  const sidePanelTitle = showParticipants ? "Participants" : "Chat"

  // Unread Messages Logic
  const [unreadMessages, setUnreadMessages] = React.useState(0)
  const prevMessagesLength = React.useRef(messages.length)

  React.useEffect(() => {
    if (messages.length > prevMessagesLength.current) {
      if (!showChat) {
        // Count new messages not from me
        let newUnread = 0
        for (let i = prevMessagesLength.current; i < messages.length; i++) {
          if (String(messages[i].senderId) !== String(currentUserId)) {
            newUnread++
          }
        }
        setUnreadMessages((prev) => prev + newUnread)
      }
    }
    prevMessagesLength.current = messages.length
  }, [messages, showChat, currentUserId])

  React.useEffect(() => {
    if (showChat) {
      setUnreadMessages(0)
    }
  }, [showChat])

  // Let the API handle 401. If we have no user and not loading, it means we failed to auth.
  if (!isLoadingUser && !user) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return (
    <div className="flex h-full w-full flex-col bg-primary2 text-textColor font-sans">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-[#C6C6C6] bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex w-40 shrink-0 items-center">
            <HeaderLogo />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">
              {session?.name || session?.roomName || "General"}
            </div>
            <div className="text-xs text-gray-500">
              {formatDate(new Date())}
            </div>
          </div>
        </div>
        <div>
          <div className="text-xs font-medium text-gray-500">
            {formattedElapsed}
            {formattedMax ? ` / ${formattedMax}` : ""}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
        {/* Video Area */}
        <div className="relative flex flex-1 flex-col bg-gradient-to-br from-primary2 via-white to-primary2">
          <div className="absolute inset-0 bg-[url('/bg-pattern.svg')] opacity-[0.03] pointer-events-none" />
          <VideoGrid
            localStream={localStream}
            peers={peers}
            participants={activeParticipants}
            currentUserId={currentUserId}
          />
        </div>

        {/* Desktop Side Panel (Chat or Participants) */}
        {isSidePanelOpen && (
          <div className="hidden w-80 flex-col border-l border-[#C6C6C6] bg-white md:flex">
            {showParticipants && (
              <ParticipantList
                participants={activeParticipants}
                peers={peers}
                currentUserId={currentUserId}
              />
            )}

            {showChat && !showParticipants && (
              <ChatBox
                messages={messages}
                currentUser={user}
                allParticipants={activeParticipants}
                onSendMessage={handleSendMessage}
                isConnected={isConnected}
                className="h-full w-full"
              />
            )}
          </div>
        )}

        {/* Mobile Overlay Side Panel */}
        {isSidePanelOpen && (
          <div className="md:hidden">
            <div
              className="fixed inset-0 z-30 flex bg-black/40"
              onClick={() => {
                setShowChat(false)
                setShowParticipants(false)
              }}
            >
              <div
                className="ml-auto flex h-full w-full max-w-sm flex-col bg-white shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="flex w-full items-center gap-2 border-b border-[#C6C6C6] px-4 py-3 text-left hover:bg-gray-50"
                  onClick={() => {
                    setShowChat(false)
                    setShowParticipants(false)
                  }}
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary2/10 text-primary1">
                    <ChevronRight className="h-4 w-4 rotate-180" />
                  </span>
                  <div className="text-[0.9rem] font-semibold text-gray-900">
                    {sidePanelTitle}
                  </div>
                </button>

                <div className="flex-1 overflow-y-auto">
                  {showParticipants && (
                    <ParticipantList
                      participants={activeParticipants}
                      peers={peers}
                      currentUserId={currentUserId}
                    />
                  )}

                  {showChat && !showParticipants && (
                    <ChatBox
                      messages={messages}
                      currentUser={user}
                      allParticipants={activeParticipants}
                      onSendMessage={handleSendMessage}
                      isConnected={isConnected}
                      className="h-full w-full"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <VideoCallControlBar
        micOn={micOn}
        cameraOn={cameraOn}
        showChat={showChat}
        setShowChat={setShowChat}
        showParticipants={showParticipants}
        setShowParticipants={setShowParticipants}
        unreadMessages={unreadMessages}
        localStream={localStream}
        isLeaving={isLeaving}
        handleToggleMic={handleToggleMic}
        handleToggleCam={handleToggleCam}
        handleLeaveSession={handleLeaveSession}
      />
    </div>
  )
}

const VideoCallRoom = () => {
  return (
    <VideoCallProvider>
      <VideoCallRoomContent />
    </VideoCallProvider>
  )
}

export default VideoCallRoom
