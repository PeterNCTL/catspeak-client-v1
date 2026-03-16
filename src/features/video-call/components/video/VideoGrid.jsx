import VideoTile from "./VideoTile"

const VideoGrid = ({ localStream, peers, participants, currentUserId }) => {
  // Merge participants with peers to get streams
  // We want to show:
  // 1. Local User
  // 2. Remote Participants (matched with peers streams)

  // Calculate grid columns based on count
  const count = participants.length

  /*
    Grid Layout Logic:
    - 1 participant: Full screen (center)
    - 2 participants: Side by side (1 row, 2 cols)
    - 3-4 participants: 2x2 grid (2 rows, 2 cols)
    - 5-6 participants: 2x3 grid (2 rows, 3 cols)
    - 7+ participants: 3 cols, auto rows
  */
  let gridClassName = ""

  if (count === 1) {
    gridClassName = "grid-cols-1"
  } else if (count === 2) {
    gridClassName = "grid-cols-1 sm:grid-cols-2"
  } else if (count <= 4) {
    gridClassName = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
  } else {
    gridClassName =
      "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
  }

  const scrollbarClasses =
    "[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#990011] [&::-webkit-scrollbar-track]:bg-gray-200 [&::-webkit-scrollbar]:w-1.5"

  return (
    <div
      className={`grid h-full w-full gap-2 overflow-y-auto p-2 place-content-start justify-center sm:gap-3 sm:p-3 md:gap-4 md:p-4 ${gridClassName} ${scrollbarClasses}`}
    >
      {participants.map((participant, index) => {
        // Note: isLocal calculation is still useful for UI,
        // but stream access is now normalized in `participant.stream`
        const isLocal = participant.isLocal

        // Use the stream directly attached to the participant object by useVideoCall
        const stream = participant.stream

        return (
          <div
            key={participant.id || participant.accountId || `v-${index}`}
            className="relative w-full aspect-video max-w-full"
          >
            <VideoTile
              participantId={participant.id} // Pass SDK ID for internal hook usage
              stream={stream}
              name={participant.username}
              avatar={participant.avatarImageUrl} // Note: VideoSDK might not pass this in metaData, check implementation
              isLocal={isLocal}
              micOn={participant.isMicOn !== false} // Default to true if undefined
              videoOn={participant.isCameraOn !== false} // Default to true if undefined
            />
          </div>
        )
      })}
    </div>
  )
}

export default VideoGrid
