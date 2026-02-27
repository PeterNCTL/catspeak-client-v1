import React, { useRef, useEffect, useState } from "react"
import { MOCK_EVENTS } from "../../data/mockEvents"
import { processOverlappingEvents } from "./utils/EventUtils"
import TimelineGrid from "./TimelineGrid"
import EventBlock from "./EventBlock"
import EventDetailModal from "./EventDetailModal"

const HOUR_HEIGHT = 100 // pixels per hour

const MailCalendarDetail = ({ selectedDate, currentDate, onClose }) => {
  const scrollRef = useRef(null)
  const [selectedEvent, setSelectedEvent] = useState(null)

  useEffect(() => {
    // Scroll to 8 AM by default when opened
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 8 * HOUR_HEIGHT - 20
    }
  }, [selectedDate])

  if (selectedDate === null) return null

  const displayDate = currentDate.date(selectedDate)
  const formattedDate = displayDate.format("MMMM D, YYYY")
  const ddMmYyyy = displayDate.format("DD/MM/YYYY")

  const positionedEvents = processOverlappingEvents(MOCK_EVENTS)

  return (
    <div className="col-span-7 w-full my-2 h-full min-h-[400px] sm:min-h-[500px]">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-[#E5E5E5] shadow-sm p-3 sm:p-6 w-full flex flex-col h-[500px] sm:h-[700px] transition-all">
        {/* Calendar Day View Scroll Container */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto pr-2 bg-gray-50/30 rounded-xl relative border border-gray-100 [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-gray-200 [&::-webkit-scrollbar-thumb]:bg-[#990011] [&::-webkit-scrollbar-thumb]:rounded-[3px]"
        >
          <div
            className="relative w-full mt-4"
            style={{ height: `${24 * HOUR_HEIGHT}px` }}
          >
            {/* Timeline Background Grid */}
            <TimelineGrid hourHeight={HOUR_HEIGHT} />

            {/* Events Rendering */}
            <div className="absolute top-0 bottom-0 left-16 right-4">
              {positionedEvents.map((event) => (
                <EventBlock
                  key={event.id}
                  event={event}
                  hourHeight={HOUR_HEIGHT}
                  ddMmYyyy={ddMmYyyy}
                  onClick={() => setSelectedEvent(event)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        ddMmYyyy={ddMmYyyy}
      />
    </div>
  )
}

export default MailCalendarDetail
