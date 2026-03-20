import { Mic, MicOff, Video, VideoOff } from "lucide-react"
import { useParticipant, useMeeting } from "@videosdk.live/react-sdk"
import useAudioLevel from "../hooks/useAudioLevel"

/**
 * A single row in the participant list.
 * All reactive state (mic/cam) comes from useParticipant() for remote participants,
 * or from the localMicOn/localCameraOn props for the local user.
 */
const ParticipantItem = ({ participantId, isLocal, localMicOn, localCameraOn }) => {
  const { displayName, micStream, micOn, webcamOn } = useParticipant(participantId)
  const audioTrack = micStream?.track ?? null
  const audioLevel = useAudioLevel(audioTrack)

  const isMicOn = isLocal ? localMicOn : (micOn ?? false)
  const isCameraOn = isLocal ? localCameraOn : (webcamOn ?? false)
  const name = displayName || (isLocal ? "You" : "Guest")
  const initial = name.charAt(0).toUpperCase()

  return (
    <div className="flex items-center justify-between pl-1.5 pr-2 py-1 rounded">
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10">
          <div className="w-10 h-10 rounded-full border border-[#C6C6C6] bg-gray-300 flex items-center justify-center text-gray-800 text-sm font-semibold">
            {initial}
          </div>
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
            {name} {isLocal && "(You)"}
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

/**
 * Participant list panel.
 *
 * Props:
 *  participantIds  – ordered array of VideoSDK participant IDs (local first)
 *  currentUserId   – the logged-in user's accountId (to identify the local tile)
 *  localMicOn      – reactive local mic state from useVideoCall()
 *  localCameraOn   – reactive local cam state from useVideoCall()
 */
const ParticipantList = ({ participantIds, currentUserId, localMicOn, localCameraOn }) => {
  const { localParticipant } = useMeeting()
  const localSdkId = localParticipant?.id

  return (
    <div className="flex flex-col h-full w-full bg-white">
      <div className="px-4 py-3 border-b border-[#C6C6C6]">
        <h3 className="text-sm font-semibold m-0">Participants ({participantIds.length})</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <ul className="flex flex-col">
          {participantIds.map((pid) => (
            <li key={pid}>
              <ParticipantItem
                participantId={pid}
                isLocal={pid === localSdkId}
                localMicOn={localMicOn}
                localCameraOn={localCameraOn}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ParticipantList
