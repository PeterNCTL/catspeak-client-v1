import React, { useState, useRef, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { FluentAnimation } from "@/shared/animations"

const TimeDropdown = ({ value, onChange, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const getCurrentTime = () => {
    const now = new Date()
    return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
  }

  const [selectedTime, setSelectedTime] = useState(value || getCurrentTime())

  useEffect(() => {
    if (value !== undefined) {
      setSelectedTime(value)
    }
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleHourSelect = (hour) => {
    const [, min] = selectedTime.split(":")
    const newTime = `${hour}:${min || getCurrentTime().split(":")[1]}`
    setSelectedTime(newTime)
    if (onChange) onChange(newTime)
  }

  const handleMinuteSelect = (min) => {
    const [h] = selectedTime.split(":")
    const newTime = `${h || getCurrentTime().split(":")[0]}:${min}`
    setSelectedTime(newTime)
    if (onChange) onChange(newTime)
    setIsOpen(false)
  }

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0"),
  )
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0"),
  )

  const [currentHour, currentMinute] = selectedTime.split(":")

  // Refs for auto-scrolling
  const hoursRef = useRef(null)
  const minutesRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (hoursRef.current) {
          const selectedHourEl = hoursRef.current.querySelector(
            ".bg-\\[\\#B91264\\]",
          )
          if (selectedHourEl) {
            selectedHourEl.scrollIntoView({ block: "center" })
          }
        }
        if (minutesRef.current) {
          const selectedMinEl = minutesRef.current.querySelector(
            ".bg-\\[\\#B91264\\]",
          )
          if (selectedMinEl) {
            selectedMinEl.scrollIntoView({ block: "center" })
          }
        }
      }, 0)
    }
  }, [isOpen])

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center border border-gray-200 rounded-md px-3 py-1.5 text-[13px] sm:text-sm font-bold text-gray-800 w-[90px] shadow-sm hover:bg-gray-50 transition-colors outline-none bg-white h-full"
      >
        <span>{selectedTime}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="absolute z-50 top-full mt-1 left-0 w-[140px] h-[200px] origin-top-left pointer-events-none">
            <FluentAnimation
              direction="down"
              exit={true}
              className="pointer-events-auto w-full h-full flex bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden"
            >
              {/* Hours Column */}
              <div
                ref={hoursRef}
                className="flex-[1] overflow-y-auto scrollbar-none border-r border-gray-100"
              >
                {hours.map((hour) => (
                  <div
                    key={`h-${hour}`}
                    onClick={() => handleHourSelect(hour)}
                    className={`flex justify-center items-center py-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors ${
                      currentHour === hour
                        ? "bg-[#B91264] text-white font-bold hover:bg-pink-800"
                        : "text-gray-700 font-medium"
                    }`}
                  >
                    {hour}
                  </div>
                ))}
              </div>

              {/* Minutes Column */}
              <div
                ref={minutesRef}
                className="flex-[1] overflow-y-auto scrollbar-none"
              >
                {minutes.map((minute) => (
                  <div
                    key={`m-${minute}`}
                    onClick={() => handleMinuteSelect(minute)}
                    className={`flex justify-center items-center py-2 text-sm cursor-pointer hover:bg-gray-100 transition-colors ${
                      currentMinute === minute
                        ? "bg-[#B91264] text-white font-bold hover:bg-pink-800"
                        : "text-gray-700 font-medium"
                    }`}
                  >
                    {minute}
                  </div>
                ))}
              </div>
            </FluentAnimation>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TimeDropdown
