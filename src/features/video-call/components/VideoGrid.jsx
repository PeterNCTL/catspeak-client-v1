import React from "react"
import { useParticipants, useLocalParticipant } from "@livekit/components-react"

import VideoTile from "./VideoTile"
import ScreenShareTile from "./ScreenShareTile"

/**
 * Renders a responsive grid of VideoTile components.
 * When a screen is being shared, switches to a spotlight layout:
 *   - Screen share tile takes the main area
 *   - Webcam tiles go into a scrollable sidebar/strip
 */
const VideoGrid = ({
  participantIds: propIds,
  screenShareOn,
  screenShareStream,
  screenSharePresenterId,
  presenterDisplayName,
  isLocalScreenShare,
}) => {
  const participants = useParticipants()
  const { localParticipant } = useLocalParticipant()

  // Build ordered identity list: local first, then remotes.
  const ids =
    propIds ??
    (() => {
      const list = localParticipant ? [localParticipant.identity] : []
      participants.forEach((p) => {
        if (p.identity !== localParticipant?.identity) list.push(p.identity)
      })
      return list
    })()

  const gridClass = "min-[426px]:grid-cols-[repeat(auto-fit,minmax(260px,1fr))]"

  const scrollbarClasses =
    "[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#990011] [&::-webkit-scrollbar-track]:bg-gray-200 [&::-webkit-scrollbar]:w-1.5"

  // ─── Spotlight layout when someone is sharing their screen ───
  if (screenShareOn && screenSharePresenterId && screenShareStream) {
    return (
      <div className="flex h-full w-full flex-col gap-2 p-2 sm:p-3 md:flex-row md:gap-3 md:p-4 overflow-hidden">
        {/* Main: screen share tile */}
        <div className="flex-1 min-h-0 min-w-0">
          <ScreenShareTile
            screenShareStream={screenShareStream}
            presenterDisplayName={presenterDisplayName ?? "Unknown"}
            isLocal={isLocalScreenShare}
          />
        </div>

        {/* Sidebar: webcam tiles */}
        <div
          className={`
            flex gap-2 overflow-auto
            md:w-56 md:flex-col md:shrink-0
            max-md:h-32 max-md:flex-row max-md:shrink-0
            ${scrollbarClasses}
          `}
        >
          {ids.map((participantIdentity) => (
            <div
              key={participantIdentity}
              className="
                shrink-0
                md:w-full md:h-36
                max-md:h-full max-md:w-44
                rounded-lg overflow-hidden
              "
            >
              <VideoTile participantIdentity={participantIdentity} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ─── Normal grid layout (no screen share) ───
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
      {ids.map((participantIdentity) => (
        <div
          key={participantIdentity}
          className="relative w-full max-w-full max-[425px]:min-h-[300px] max-[425px]:flex-1 max-[425px]:shrink-0"
        >
          <VideoTile participantIdentity={participantIdentity} />
        </div>
      ))}
    </div>
  )
}

export default VideoGrid
