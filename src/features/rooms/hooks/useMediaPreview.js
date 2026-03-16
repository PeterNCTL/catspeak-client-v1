import { useState, useEffect, useRef } from "react"

/**
 * Custom hook to manage media preview (mic/camera) for the Waiting Room.
 *
 * @param {Object} options
 * @param {Function} options.onError - Callback to handle errors (e.g., permission denied)
 * @returns {Object} { micOn, cameraOn, localStream, toggleMic, toggleCamera }
 */
export const useMediaPreview = ({ onError }) => {
  const [micOn, setMicOn] = useState(false)
  const [cameraOn, setCameraOn] = useState(false)

  const [videoTrack, setVideoTrack] = useState(null)
  const [audioTrack, setAudioTrack] = useState(null)
  const [localStream, setLocalStream] = useState(null)

  const onErrorRef = useRef(onError)

  useEffect(() => {
    onErrorRef.current = onError
  }, [onError])

  // -- Video Effect --
  useEffect(() => {
    let active = true
    let newTrack = null

    const updateVideo = async () => {
      if (cameraOn) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          })
          newTrack = stream.getVideoTracks()[0]
          if (active) {
            setVideoTrack((prev) => {
              if (prev) prev.stop()
              return newTrack
            })
          } else {
            newTrack.stop()
          }
        } catch (err) {
          console.error("Error getting video:", err)
          if (
            err.name === "NotAllowedError" ||
            err.name === "PermissionDeniedError" ||
            err.name === "NotReadableError"
          ) {
            setCameraOn(false)
            if (onErrorRef.current) onErrorRef.current("camera")
          }
        }
      } else {
        setVideoTrack((prev) => {
          if (prev) prev.stop()
          return null
        })
      }
    }

    updateVideo()

    return () => {
      active = false
      if (newTrack) newTrack.stop()
      setVideoTrack((prev) => {
        if (prev) prev.stop()
        return null
      })
    }
  }, [cameraOn])

  // -- Audio Effect --
  useEffect(() => {
    let active = true
    let newTrack = null

    const updateAudio = async () => {
      if (micOn) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          })
          newTrack = stream.getAudioTracks()[0]
          if (active) {
            setAudioTrack((prev) => {
              if (prev) prev.stop()
              return newTrack
            })
          } else {
            newTrack.stop()
          }
        } catch (err) {
          console.error("Error getting audio:", err)
          if (
            err.name === "NotAllowedError" ||
            err.name === "PermissionDeniedError" ||
            err.name === "NotReadableError"
          ) {
            setMicOn(false)
            if (onErrorRef.current) onErrorRef.current("mic")
          }
        }
      } else {
        setAudioTrack((prev) => {
          if (prev) prev.stop()
          return null
        })
      }
    }

    updateAudio()

    return () => {
      active = false
      if (newTrack) newTrack.stop()
      setAudioTrack((prev) => {
        if (prev) prev.stop()
        return null
      })
    }
  }, [micOn])

  // -- Local Stream Assembly --
  useEffect(() => {
    const tracks = []
    if (videoTrack) tracks.push(videoTrack)
    if (audioTrack) tracks.push(audioTrack)

    if (tracks.length > 0) {
      setLocalStream(new MediaStream(tracks))
    } else {
      setLocalStream(null)
    }
  }, [videoTrack, audioTrack])

  const toggleMic = () => setMicOn((prev) => !prev)
  const toggleCamera = () => setCameraOn((prev) => !prev)

  return {
    micOn,
    cameraOn,
    localStream,
    toggleMic,
    toggleCamera,
  }
}

export default useMediaPreview
