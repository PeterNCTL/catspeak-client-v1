import { Mic, MicOff, Video, VideoOff } from "lucide-react"
import { useParticipant } from "@videosdk.live/react-sdk"
import useAudioLevel from "../hooks/useAudioLevel"
import { useVideoCallContext } from "@/shared/context/video/VideoCallContext"

const ParticipantItem = ({
  participant,
  isMe,
  stream,
  localMicOn,
  localCameraOn,
}) => {
  // For remote participants, subscribe via useParticipant so we get reactive
  // mic/webcam events from the SDK. For local we rely on the already-reactive
  // localMicOn/localCameraOn from context (driven by useParticipant there).
  const { micOn: remoteMicOn, webcamOn: remoteWebcamOn } = useParticipant(
    !isMe ? participant.id : ""
  )
  const audioLevel = useAudioLevel(stream)

  const isMicOn = isMe ? localMicOn : (remoteMicOn ?? participant.isMicOn ?? false)
  const isCameraOn = isMe ? localCameraOn : (remoteWebcamOn ?? participant.isCameraOn ?? false)
  const username = participant.username || "Unknown"
  const initial = username.charAt(0).toUpperCase()

  return (
    <div className="flex items-center justify-between pl-1.5 pr-2 py-1 rounded">
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10">
          {participant.avatarImageUrl ? (
            <img
              src={participant.avatarImageUrl}
              alt={username}
              className="w-10 h-10 rounded-full border border-[#C6C6C6] bg-gray-100 object-cover text-gray-900 text-sm font-semibold"
            />
          ) : (
            <div className="w-10 h-10 rounded-full border border-[#C6C6C6] bg-gray-300 flex items-center justify-center text-gray-800 text-sm font-semibold">
              {initial}
            </div>
          )}

          {isMicOn && audioLevel > 5 && (
            <div
              className="absolute inset-0 rounded-full border-2 border-[#C6C6C6] opacity-80"
              style={{
                boxShadow: "0 0 10px rgba(46, 125, 50, 0.6)",
                transform: `scale(${1 + Math.min(audioLevel / 50, 0.3)})`,
                transition: "transform 100ms ease-out",
              }}
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate m-0">
            {username} {isMe && "(You)"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isCameraOn ? (
          <Video className="w-[18px] h-[18px] text-gray-500" />
        ) : (
          <VideoOff className="w-[18px] h-[18px] text-[#990011]" />
        )}
        {isMicOn ? (
          <Mic className="w-[18px] h-[18px] text-gray-500" />
        ) : (
          <MicOff className="w-[18px] h-[18px] text-[#990011]" />
        )}
      </div>
    </div>
  )
}

const ParticipantList = ({ participants, currentUserId }) => {
  const { micOn, cameraOn } = useVideoCallContext() || {}
  const count = Array.isArray(participants) ? participants.length : 0

  return (
    <div className="flex flex-col h-full w-full bg-white">
      <div className="px-4 py-3 border-b border-[#C6C6C6]">
        <h3 className="text-sm font-semibold m-0">Participants ({count})</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <ul className="flex flex-col">
          {participants?.map((p, index) => {
            const currentId = String(currentUserId)
            const isMe =
              String(p.accountId ?? "") === currentId ||
              String(p.userId ?? "") === currentId ||
              String(p.id ?? "") === currentId

            return (
              <li key={p.accountId ?? p.id ?? p.userId ?? `p-${index}`}>
                <ParticipantItem
                  participant={p}
                  isMe={isMe}
                  stream={p.stream}
                  localMicOn={micOn}
                  localCameraOn={cameraOn}
                />
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default ParticipantList
