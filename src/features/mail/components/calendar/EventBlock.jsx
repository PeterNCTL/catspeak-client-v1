import React from "react"
import { Clock, Calendar, MapPin } from "lucide-react"
import { parseTime } from "./utils/EventUtils"
import { IconLogo } from "../../../../shared/assets/icons/logo"

const EventBlock = ({ event, hourHeight, ddMmYyyy, onClick }) => {
  const start = parseTime(event.startTime)
  const end = parseTime(event.endTime)
  // Minimum height of 70px to fit contents neatly
  const blockHeight = Math.max((end - start) * hourHeight, 70)
  const topPos = start * hourHeight

  // Adjust for overlap width and left offset
  const widthPercentage = 100 / event.groupCols
  const leftPercentage = event.colIdx * widthPercentage

  // Minor deduction in width to allow small gap between overlapping items
  const styleObj = {
    top: `${topPos}px`,
    height: `${blockHeight}px`,
    left: `calc(${leftPercentage}% + ${event.colIdx > 0 ? 4 : 0}px)`,
    width: `calc(${widthPercentage}% - ${event.groupCols > 1 ? 4 : 0}px)`,
    zIndex: 10 + event.colIdx,
  }

  return (
    <div
      onClick={onClick}
      className={`absolute rounded-xl p-3 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col justify-start group text-white ${event.color}`}
      style={styleObj}
    >
      <div className="flex items-center gap-2 mb-2 shrink-0">
        <div className="p-1 rounded-md">
          <img src={IconLogo} alt="Logo" width={14} height={14} />
        </div>
        <span className="font-bold text-base truncate">{event.title}</span>
      </div>

      <div className="flex flex-col gap-1.5 text-sm font-medium pl-1 overflow-y-auto no-scrollbar pb-1">
        <div className="flex items-center gap-2">
          <Clock size={12} className="shrink-0" />
          <span className="truncate">
            {event.startTime} - {event.endTime}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Calendar size={12} className="shrink-0" />
          <span className="truncate">{ddMmYyyy}</span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin size={12} className="shrink-0" />
          <span className="truncate">{event.location}</span>
        </div>
      </div>
    </div>
  )
}

export default EventBlock
