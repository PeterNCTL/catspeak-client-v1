import React, { useState } from "react"
import { X, Share } from "lucide-react"
import Modal from "../../../../shared/components/ui/Modal"
import Checkbox from "../../../../shared/components/ui/Checkbox"
import { IconLogo } from "../../../../shared/assets/icons/logo"

const EventDetailModal = ({ event, onClose, ddMmYyyy }) => {
  const [isRecurringChecked, setIsRecurringChecked] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)

  if (!event) return null

  return (
    <Modal
      open={!!event}
      onClose={onClose}
      showCloseButton={false}
      className="p-0 !max-w-[700px] w-full bg-[#EAEAEA] rounded-[20px] overflow-visible"
    >
      <div className="relative flex flex-col w-full h-full bg-white rounded-[20px]">
        {/* Overlapping Custom Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-5 -right-5 bg-[#B81919] text-white p-2 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.3)] z-50 hover:bg-red-800 transition-colors border-[4px] border-white"
        >
          <X size={26} strokeWidth={4} />
        </button>

        {/* Header (Magenta) */}
        <div className="bg-[#B91264] text-white pt-8 pb-5 px-8 rounded-t-[20px] border-b-[2px] border-white z-10 relative overflow-hidden">
          <h2 className="text-3xl leading-none font-bold uppercase mb-4 tracking-wide relative z-10">
            {event.title}
          </h2>
          <div className="flex items-center gap-3 opacity-95 text-base font-medium relative z-10">
            <img
              src={IconLogo}
              alt="Location Logo"
              className="w-6 h-6 object-cover"
            />
            <span>Đại học FPT</span>
          </div>
        </div>

        {/* Body Content */}
        <div className="px-8 pt-6 pb-2 relative bg-white text-base">
          {/* The vertical magenta bar on the right side */}
          {/* <div className="absolute right-6 top-8 bottom-0 w-[6px] bg-[#B91264] rounded-full"></div> */}

          <div className="flex flex-col gap-5 text-black pr-6">
            <div className="flex items-baseline gap-2">
              <span className="font-bold min-w-max">Thời gian:</span>
              <span className="text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis">
                {event.startTime} - {event.endTime} (GMT + 07:00)
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-bold min-w-max">Địa điểm:</span>
              <span className="text-gray-800 tracking-wide">
                {event.location || "Đại học FPT"}
              </span>
            </div>

            <div className="flex items-end gap-2 w-full">
              <span className="font-bold min-w-max">Mô tả:</span>
              <div className="flex-1 border-b-[2px] border-dotted border-gray-500 mb-1 opacity-60"></div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-bold min-w-max">Số lượng đã đăng kí:</span>
              <span className="italic text-gray-800">20/50</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold min-w-max">Điều kiện:</span>
              <div className="flex items-center gap-2 text-[15px]">
                <span className="bg-[#B91264] text-white px-3 py-0.5 rounded italic shadow-sm leading-tight">
                  free
                </span>
                <span className="font-bold text-gray-500">,</span>
                <span className="bg-[#B91264] text-white px-3 py-0.5 rounded italic shadow-sm leading-tight">
                  gì đó
                </span>
              </div>
            </div>

            {/* Checkbox text */}
            <div className="flex items-center gap-3">
              <Checkbox
                id="recurring-event"
                checked={isRecurringChecked}
                onChange={(e) => setIsRecurringChecked(e.target.checked)}
                className="w-5 h-5"
              />
              <label
                htmlFor="recurring-event"
                className="text-[#7A7574] text-sm cursor-pointer"
              >
                Đây là sự kiện thường xuyên/có lặp lại, đăng kí tham gia toàn bộ
                sự kiện này
              </label>
            </div>
          </div>
        </div>

        {/* Footer Area */}
        <div className="px-8 pb-8 pt-6 flex items-center justify-between gap-4 bg-white rounded-b-[24px]">
          <button
            onClick={() => setIsRegistered(!isRegistered)}
            className={`flex-1 transition-colors text-white text-lg font-bold py-2.5 rounded-[10px] shadow-sm ${
              isRegistered
                ? "bg-cath-red-700 hover:bg-cath-red-800"
                : "bg-[#06AA3B] hover:bg-green-700"
            }`}
          >
            {isRegistered ? "Hủy đăng kí" : "Đăng kí"}
          </button>

          {/* Normal Share Icon */}
          <button className="text-[#7A7574] hover:text-red-900 hover:bg-[#F3F4F6] transition-colors shrink-0 p-1 flex items-center justify-center rounded-full w-10 h-10">
            <Share size={24} />
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default EventDetailModal
