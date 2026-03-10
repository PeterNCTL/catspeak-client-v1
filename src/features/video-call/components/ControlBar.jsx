import React from "react"
import {
  Video,
  VideoOff,
  MonitorUp,
  MessageSquare,
  Users,
  MoreVertical,
} from "lucide-react"

import MicButton from "./MicButton"
import InDevelopmentModal from "@/shared/components/common/InDevelopmentModal"
import PillButton from "@/shared/components/ui/PillButton"

const VideoCallControlBar = ({
  micOn,
  cameraOn,
  showChat,
  setShowChat,
  showParticipants,
  setShowParticipants,
  unreadMessages,
  localStream,
  isLeaving,
  handleToggleMic,
  handleToggleCam,
  handleLeaveSession,
}) => {
  const [showDevModal, setShowDevModal] = React.useState(false)

  // Common button styles
  const buttonBaseClass =
    "flex items-center justify-center rounded-full transition-colors shadow-sm w-12 h-12"
  const inactiveClass =
    "bg-[#F2F2F2] text-gray-600 hover:bg-[#D9D9D9] hover:text-gray-900"
  const activeErrorClass = "bg-red-500 text-white hover:bg-red-600"
  const activeWarningClass = "bg-yellow-500 text-white hover:bg-yellow-600"
  const activeToggleClass = "bg-cath-red-600 text-white hover:bg-cath-red-700"

  return (
    <>
      <div className="flex w-full flex-col gap-3 border-t border-[#C6C6C6] bg-white px-3 py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-3">
        {/* Timer Placeholder */}
        <div className="hidden w-32 text-sm font-semibold text-gray-900 sm:block"></div>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <MicButton
            micOn={micOn}
            onToggle={handleToggleMic}
            stream={localStream}
            className="z-10"
          />

          <button
            onClick={handleToggleCam}
            title={cameraOn ? "Turn camera off" : "Turn camera on"}
            className={`${buttonBaseClass} ${
              cameraOn ? activeErrorClass : inactiveClass
            }`}
          >
            {cameraOn ? <Video /> : <VideoOff />}
          </button>

          <button
            onClick={() => setShowDevModal(true)}
            title="Screen share (in development)"
            className={`${buttonBaseClass} ${inactiveClass}`}
          >
            <MonitorUp />
          </button>

          {/* Vertical Divider Removed */}

          {/* Participants Toggle */}
          <button
            onClick={() => {
              setShowParticipants(!showParticipants)
              setShowChat(false)
            }}
            title="Participants"
            className={`${buttonBaseClass} ${
              showParticipants ? activeToggleClass : inactiveClass
            }`}
          >
            <Users />
          </button>

          {/* Chat Toggle */}
          <div className="relative">
            <button
              onClick={() => {
                setShowChat(!showChat)
                setShowParticipants(false)
              }}
              title="Chat"
              className={`${buttonBaseClass} ${
                showChat ? activeToggleClass : inactiveClass
              }`}
            >
              <MessageSquare />
            </button>
            {unreadMessages > 0 && (
              <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm animate-bounce">
                {unreadMessages > 9 ? "9+" : unreadMessages}
              </div>
            )}
          </div>

          {/* More button removed */}
        </div>

        <div className="flex w-full justify-center sm:w-32 sm:justify-end">
          <PillButton onClick={handleLeaveSession} disabled={isLeaving}>
            {isLeaving ? "Leaving..." : "Leave"}
          </PillButton>
        </div>
      </div>

      <InDevelopmentModal
        open={showDevModal}
        onCancel={() => setShowDevModal(false)}
      />
    </>
  )
}

export default VideoCallControlBar
