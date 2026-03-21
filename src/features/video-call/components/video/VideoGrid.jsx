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
  const ids =
    propIds ??
    (() => {
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
  const gridClass = "min-[426px]:grid-cols-[repeat(auto-fit,minmax(260px,1fr))]"

  const scrollbarClasses =
    "[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#990011] [&::-webkit-scrollbar-track]:bg-gray-200 [&::-webkit-scrollbar]:w-1.5"

  return (
    <div
      className={`
    flex flex-col min-[426px]:grid h-full w-full
    gap-2 sm:gap-3 md:gap-4
    p-2 sm:p-3 md:p-4
    overflow-y-auto
    min-[426px]:place-content-center
    min-[426px]:auto-rows-fr
    ${gridClass}
    ${scrollbarClasses}
  `}
    >
      {ids.map((participantId) => (
        <div
          key={participantId}
          className="relative w-full max-w-full max-[425px]:min-h-[300px] max-[425px]:flex-1 max-[425px]:shrink-0"
        >
          <VideoTile participantId={participantId} />
        </div>
      ))}
    </div>
  )
}

export default VideoGrid
