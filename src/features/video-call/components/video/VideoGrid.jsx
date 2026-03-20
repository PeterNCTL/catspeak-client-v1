import { useMeeting } from "@videosdk.live/react-sdk"
import VideoTile from "./VideoTile"

/**
 * Renders a responsive grid of VideoTile components.
 * Reads participant IDs directly from useMeeting() — no props needed for the list.
 * Accepts an optional `participantIds` override (e.g. to apply dedup logic from context).
 */
const VideoGrid = ({ participantIds: propIds }) => {
  const { participants, localParticipant } = useMeeting()

  // Build ordered ID list: local first, then remotes.
  const ids = propIds ?? (() => {
    const list = localParticipant ? [localParticipant.id] : []
    ;[...participants.values()].forEach((p) => {
      if (p.id !== localParticipant?.id) list.push(p.id)
    })
    return list
  })()

  const count = ids.length

  /*
    Grid layout:
    1  → full-width single tile
    2  → side by side
    3-4 → 2-col grid
    5+  → 3-col grid
  */
  const gridClass =
    count === 1 ? "grid-cols-1" :
    count === 2 ? "grid-cols-1 sm:grid-cols-2" :
    count <= 4  ? "grid-cols-2" :
                  "grid-cols-2 md:grid-cols-3"

  const scrollbarClasses =
    "[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#990011] [&::-webkit-scrollbar-track]:bg-gray-200 [&::-webkit-scrollbar]:w-1.5"

  return (
    <div
      className={`grid h-full w-full gap-2 overflow-y-auto p-2 place-content-start justify-center sm:gap-3 sm:p-3 md:gap-4 md:p-4 ${gridClass} ${scrollbarClasses}`}
    >
      {ids.map((participantId) => (
        <div
          key={participantId}
          className="relative w-full aspect-video max-w-full"
        >
          <VideoTile participantId={participantId} />
        </div>
      ))}
    </div>
  )
}

export default VideoGrid
