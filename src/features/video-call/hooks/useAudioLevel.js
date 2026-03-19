import { useState, useEffect, useRef } from "react"

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

const useAudioLevel = (audioTrack) => {
  const [level, setLevel] = useState(0)

  const analyserRef = useRef(null)
  const sourceRef = useRef(null)
  const rafRef = useRef(null)
  const trackIdRef = useRef(null)

  useEffect(() => {
    if (!audioTrack) {
      setLevel(0)
      return
    }

    // Only re-init if track changed
    if (trackIdRef.current === audioTrack.id) return
    trackIdRef.current = audioTrack.id

    // Cleanup previous
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    if (sourceRef.current) sourceRef.current.disconnect()
    if (analyserRef.current) analyserRef.current.disconnect()

    try {
      const audioContext = getAudioContext()

      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.8

      const stream = new MediaStream([audioTrack])
      const source = audioContext.createMediaStreamSource(stream)

      source.connect(analyser)

      analyserRef.current = analyser
      sourceRef.current = source

      const dataArray = new Uint8Array(analyser.fftSize)

      const update = () => {
        analyser.getByteTimeDomainData(dataArray)

        let sum = 0
        for (let i = 0; i < dataArray.length; i++) {
          const normalized = (dataArray[i] - 128) / 128
          sum += normalized * normalized
        }

        const rms = Math.sqrt(sum / dataArray.length)
        setLevel(rms * 100)

        rafRef.current = requestAnimationFrame(update)
      }

      update()
    } catch (err) {
      console.error("AudioLevel error:", err)
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (sourceRef.current) sourceRef.current.disconnect()
      if (analyserRef.current) analyserRef.current.disconnect()
    }
  }, [audioTrack])

  return level
}

export default useAudioLevel
