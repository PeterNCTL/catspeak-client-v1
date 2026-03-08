import React from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import PillButton from "@/shared/components/ui/PillButton"
import ParticipantList from "./ParticipantList"
import VideoPreview from "./VideoPreview"
import { useLanguage } from "@/shared/context/LanguageContext"

const WaitingScreen = ({
  session,
  localStream,
  micOn,
  cameraOn,
  user,
  onToggleMic,
  onToggleCam,
  onJoin,
}) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const participants = session?.participants || []
  const { t } = useLanguage()
  const communityLanguage = localStorage.getItem("communityLanguage") || "en"

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center relative bg-gray-50 p-4 md:p-0">
      {/* Back Button */}
      <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10">
        <button
          onClick={() =>
            navigate({
              pathname: `/${communityLanguage}/community`,
              search: searchParams.toString(),
            })
          }
          className="flex items-center gap-2 h-12 px-3 rounded-xl w-fit text-gray-500 hover:text-gray-900 hover:bg-[#E5E5E5] transition-colors font-medium"
        >
          <ArrowLeft className="h-6 w-6" />
          {t.rooms.waitingScreen.backToCommunity}
        </button>
      </div>

      <div className="mb-4 text-center">
        <h4 className="mb-1 font-semibold text-gray-900 text-2xl md:text-4xl">
          {session?.name ||
            session?.roomName ||
            t.rooms.waitingScreen.readyToJoin}
        </h4>

        <ParticipantList participants={participants} />
      </div>

      <VideoPreview
        localStream={localStream}
        micOn={micOn}
        cameraOn={cameraOn}
        user={user}
        onToggleMic={onToggleMic}
        onToggleCam={onToggleCam}
      />

      <div className="flex flex-col items-center gap-2">
        <PillButton onClick={onJoin}>
          {t.rooms.waitingScreen.joinNow}
        </PillButton>
        <p className="text-sm text-gray-500">
          {t.rooms.waitingScreen.joinedAs}{" "}
          <span className="font-medium text-gray-900">{user?.username}</span>
        </p>
      </div>
    </div>
  )
}

export default WaitingScreen
