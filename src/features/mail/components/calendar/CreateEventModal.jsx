import React from "react"
import dayjs from "dayjs"
import { X, Globe, ChevronDown } from "lucide-react"
import Modal from "../../../../shared/components/ui/Modal"
import DatePicker from "../../../../shared/components/ui/DatePicker"
import TimeDropdown from "../ui/TimeDropdown"
import { formatTime } from "../../../../shared/utils/dateFormatter"

const CreateEventModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  const startTime = dayjs()
  const endTime = startTime.add(1, "hour")

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      showCloseButton={false}
      className="p-0 !max-w-[900px] w-full bg-[#EAEAEA] rounded-[20px] overflow-visible"
    >
      <div className="relative flex flex-col w-full bg-white rounded-[20px] shadow-xl">
        {/* Overlapping Custom Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-[#B81919] text-white p-1.5 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.3)] z-50 hover:bg-red-800 transition-colors border-[4px] border-white"
        >
          <X size={24} strokeWidth={4} />
        </button>

        {/* Header */}
        <div className="bg-[#B91264] text-white pt-6 pb-5 px-8 rounded-t-[20px] relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="TÊN SỰ KIỆN"
              className="bg-transparent text-[22px] font-bold uppercase placeholder-white font-sans outline-none w-[170px]"
            />
            <span className="text-[22px] font-light">|</span>
            <div className="w-7 h-7 rounded-full bg-[#EAEAEA] flex items-center justify-center shrink-0"></div>
            <span className="text-[17px] opacity-90 font-medium whitespace-nowrap">
              Đại học FPT
            </span>
          </div>

          <div className="flex items-center gap-3 pr-2">
            <button className="flex items-center gap-2 border border-white rounded-full px-3 py-1.5 hover:bg-white/10 transition">
              <div className="w-[14px] h-[14px] rounded-full border-[1.5px] border-white"></div>
              <span className="text-sm font-medium">Màu</span>
              <ChevronDown size={14} />
            </button>

            <button className="flex items-center gap-2 border border-white rounded-full px-3 py-1.5 hover:bg-white/10 transition">
              <Globe size={14} />
              <span className="text-sm font-medium">Public</span>
              <ChevronDown size={14} />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="px-8 pt-8 pb-6 relative bg-white text-base">
          {/* Scrollbar placeholder */}
          <div className="absolute right-4 top-16 w-[2.5px] h-36 bg-[#B91264] rounded-full"></div>

          <div className="flex flex-col gap-6 pr-8">
            {/* Top Row: Date/Time */}
            <div className="flex flex-wrap lg:flex-nowrap gap-3 items-start pb-2">
              {/* Left: start/end text with vertical line */}
              <div className="flex items-start gap-3 w-[120px] shrink-0 mt-[10px] relative">
                <div className="flex flex-col items-center absolute top-[6px] bottom-[8px] left-1">
                  <div className="w-[9px] h-[9px] rounded-full bg-[#B91264] z-10 shrink-0"></div>
                  <div className="w-[1px] flex-1 bg-gray-200 my-1"></div>
                  <div className="w-[9px] h-[9px] rounded-full border-[1.5px] border-gray-300 bg-white z-10 shrink-0"></div>
                </div>
                <div className="pl-[26px] flex flex-col gap-[28px] text-[13px] font-bold text-[#4A4A4A]">
                  <span className="leading-none mt-0.5">BẮT ĐẦU</span>
                  <span className="leading-none mt-1">KẾT THÚC</span>
                </div>
              </div>

              {/* Middle: Inputs */}
              <div className="flex flex-col gap-[14px]">
                <div className="flex gap-2">
                  <DatePicker value={startTime.toDate()} />
                  <TimeDropdown value={formatTime(startTime.toDate())} />
                </div>
                <div className="flex gap-2">
                  <DatePicker value={endTime.toDate()} />
                  <TimeDropdown value={formatTime(endTime.toDate())} />
                </div>
              </div>

              {/* Timezone */}
              <div className="border border-gray-200 rounded-[8px] p-2.5 flex flex-col justify-center items-start gap-1 shadow-sm w-[100px] h-[86px] ml-1">
                <Globe className="text-gray-300 stroke-[1.5]" size={20} />
                <div className="text-[12px] font-bold leading-tight text-gray-800 mt-1">
                  GMT +07:00
                  <br />
                  Bangkok
                </div>
              </div>

              {/* Recurrence Settings */}
              <div className="flex flex-col gap-[14px] h-[86px] justify-between pb-0 ml-1 flex-1">
                <button className="flex items-center justify-between border border-gray-200 rounded-md px-3 py-[7px] text-[13px] text-gray-500 shadow-sm w-full bg-white hover:bg-gray-50">
                  <span>Cài đặt chi tiết</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>
                <div className="flex items-center justify-between w-full h-[32px]">
                  <div className="flex items-center gap-[6px]">
                    {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => {
                      const isSelected = i === 1 || i === 4 // T and F
                      return (
                        <button
                          key={i}
                          className={`w-[25px] h-[25px] rounded-full text-[11px] font-bold flex items-center justify-center border ${isSelected ? "bg-[#B91264] text-white border-[#B91264]" : "bg-white text-gray-400 border-gray-200"}`}
                        >
                          {day}
                        </button>
                      )
                    })}
                  </div>
                  <button className="text-[12px] border border-gray-200 rounded-md px-2 h-[28px] font-medium text-gray-600 hover:bg-gray-50 shadow-sm shrink-0 whitespace-nowrap">
                    Kết thúc vào
                  </button>
                </div>
              </div>
            </div>

            {/* Other Rows */}
            <div className="flex flex-col gap-[22px] mt-2">
              <div className="flex items-center">
                <div className="w-[130px] font-bold text-[15px] text-gray-900 shrink-0">
                  Địa điểm
                </div>
                <div className="flex-1 flex items-center border-b-[1.5px] border-gray-200 pb-[6px]">
                  <input
                    type="text"
                    placeholder="Nhập địa điểm hoặc link từ ggmap"
                    className="w-full text-gray-500 placeholder-gray-500 text-[15px] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-[130px] font-bold text-[15px] text-gray-900 shrink-0">
                  Mô tả
                </div>
                <div className="flex-1 flex items-center border-b-[1.5px] border-gray-200 pb-[6px]">
                  <input
                    type="text"
                    placeholder="Nhập mô tả (tối đa 500 từ)"
                    className="w-full text-gray-500 placeholder-gray-500 text-[15px] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-[130px] font-bold text-[15px] text-gray-900 shrink-0 mt-1">
                  Số lượng tối đa
                </div>
                <div className="flex-1 flex items-center border-b-[1.5px] border-gray-200 pb-[6px] gap-3">
                  <div className="border border-gray-200 rounded-[5px] w-14 shadow-sm flex items-center justify-center bg-white px-2 py-1">
                    <input
                      type="number"
                      defaultValue="50"
                      className="w-full text-center text-black font-bold text-[15px] outline-none"
                    />
                  </div>
                  <span className="text-gray-500 text-[15px]">Khách</span>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-[130px] font-bold text-[15px] text-gray-900 shrink-0">
                  Điều kiện
                </div>
                <div className="flex-1 flex items-center border-b-[1.5px] border-gray-200 pb-[6px]">
                  <input
                    type="text"
                    placeholder="Nhập điều kiện"
                    className="w-full text-gray-500 placeholder-gray-500 text-[15px] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-[130px] font-bold text-[15px] text-gray-900 shrink-0">
                  Giá vé
                </div>
                <div className="flex-1 flex items-center justify-between border-b-[1.5px] border-gray-200 pb-[6px]">
                  <span className="text-gray-500 text-[15px]">Free</span>
                  <button className="text-[#B91264] font-bold text-[15px] hover:text-pink-800 pr-1">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 pb-8 pt-2 bg-white rounded-b-[20px]">
          <button className="w-full bg-[#B91264] text-white font-bold text-[15px] py-[10px] rounded-[6px] hover:bg-pink-800 transition-colors shadow-sm">
            Tạo sự kiện
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default CreateEventModal
