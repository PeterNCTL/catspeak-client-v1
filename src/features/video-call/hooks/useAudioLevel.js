import { useState, useEffect } from "react"

let sharedAudioContext = null

const getAudioContext = () => {
  if (!sharedAudioContext) {
    sharedAudioContext = new (
      window.AudioContext || window.webkitAudioContext
    )()
  }
  if (sharedAudioContext.state === "suspended") {
    sharedAudioContext.resume()
  }
  return sharedAudioContext
}

const useAudioLevel = (stream) => {
  const [level, setLevel] = useState(0)

  // Derive a stable key from the actual audio track IDs rather than the
  // MediaStream object reference. This means the analyser chain is only
  // rebuilt when a genuinely different microphone track arrives, not when
  // the same tracks are rewrapped in a new MediaStream on a re-render.
  const audioTrackIds = stream
    ? stream.getAudioTracks().map((t) => t.id).join(",")
    : ""

  useEffect(() => {
    if (!stream || !audioTrackIds) {
      setLevel(0)
      return
    }

    const audioTracks = stream.getAudioTracks()
    if (audioTracks.length === 0) return

    let analyser
    let source
    let animationFrameId

    const initAudio = () => {
      try {
        const audioContext = getAudioContext()
        analyser = audioContext.createAnalyser()
        analyser.fftSize = 256
        analyser.smoothingTimeConstant = 0.8

        source = audioContext.createMediaStreamSource(stream)
        source.connect(analyser)

        const dataArray = new Uint8Array(analyser.frequencyBinCount)

        const updateLevel = () => {
          analyser.getByteFrequencyData(dataArray)
          const sum = dataArray.reduce((a, b) => a + b, 0)
          const avg = sum / dataArray.length
          setLevel(avg)
          animationFrameId = requestAnimationFrame(updateLevel)
        }
        updateLevel()
      } catch (error) {
        console.error("Error initializing audio context:", error)
      }
    }

    initAudio()

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      if (source) source.disconnect()
      if (analyser) analyser.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioTrackIds]) // depend on track identity, not the stream wrapper object

  return level
}

export default useAudioLevel
