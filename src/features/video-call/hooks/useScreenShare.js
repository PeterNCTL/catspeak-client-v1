import { useMemo, useCallback } from "react"
import {
  useLocalParticipant,
  useParticipants,
  useTracks,
} from "@livekit/components-react"
import { Track } from "livekit-client"

/**
 * Encapsulates screen-share state & actions using LiveKit's APIs.
 *
 * @returns {{
 *   screenShareOn: boolean,
 *   screenShareStream: MediaStream | null,
 *   presenterId: string | null,
 *   isLocalScreenShare: boolean,
 *   toggleScreenShare: () => Promise<void>,
 *   presenterDisplayName: string | null,
 * }}
 */
export const useScreenShare = () => {
  const { localParticipant } = useLocalParticipant()

  // Get all screen share tracks from all participants
  const screenShareTracks = useTracks(
    [{ source: Track.Source.ScreenShare, withPlaceholder: false }],
    { onlySubscribed: true },
  )

  // The first screen share track is the active one
  const activeScreenShare = screenShareTracks.length > 0 ? screenShareTracks[0] : null

  const presenterId = activeScreenShare?.participant?.identity ?? null
  const presenterDisplayName = activeScreenShare?.participant?.name ?? null

  const isLocalScreenShare = Boolean(
    presenterId &&
    localParticipant &&
    presenterId === localParticipant.identity,
  )

  const screenShareOn = Boolean(activeScreenShare?.publication?.track)

  // Build a stable MediaStream from the screen-share track.
  const screenShareStream = useMemo(() => {
    const mediaStreamTrack = activeScreenShare?.publication?.track?.mediaStreamTrack
    if (!mediaStreamTrack || !screenShareOn) return null
    return new MediaStream([mediaStreamTrack])
  }, [activeScreenShare?.publication?.track?.mediaStreamTrack, screenShareOn])

  const toggleScreenShare = useCallback(async () => {
    if (!localParticipant) return

    const isSharing = localParticipant.isScreenShareEnabled
    await localParticipant.setScreenShareEnabled(!isSharing)
  }, [localParticipant])

  return {
    screenShareOn,
    screenShareStream,
    presenterId,
    isLocalScreenShare,
    toggleScreenShare,
    presenterDisplayName,
  }
}
