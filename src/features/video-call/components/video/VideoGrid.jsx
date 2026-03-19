import VideoTile from "./VideoTile"

const VideoGrid = ({ participants }) => {
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
        return (
          <div
            key={participant.id || participant.accountId || `v-${index}`}
            className="relative w-full aspect-video max-w-full"
          >
            <VideoTile
              participantId={participant.id}
              avatar={participant.avatarImageUrl}
            />
          </div>
        )
      })}
    </div>
  )
}

export default VideoGrid
