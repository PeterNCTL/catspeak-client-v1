import React from "react"
import { MessageCircle, Monitor, Users, Layers } from "lucide-react"
import { useLanguage } from "@/shared/context/LanguageContext"

const RoomsTabs = ({ tab, setTab }) => {
  const { t } = useLanguage()

  const tabs = [
    {
      value: "communicate",
      icon: MessageCircle,
      label: t.rooms.tabs.communicate,
    },
    { value: "teaching", icon: Monitor, label: t.rooms.tabs.teaching },
    { value: "group", icon: Users, label: t.rooms.tabs.group },
    { value: "class", icon: Layers, label: t.rooms.tabs.class },
  ]

  return (
    <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {tabs.map((tItem) => {
        const isSelected = tab === tItem.value
        const Icon = tItem.icon
        return (
          <button
            key={tItem.value}
            onClick={() => setTab(tItem.value)}
            className={`
              flex text-sm items-center gap-3 px-4 min-h-[48px] hover:bg-[#E5E5E5] whitespace-nowrap rounded-lg
              ${
                isSelected
                  ? "bg-[#F2F2F2] text-[#990011]"
                  : "hover:text-[#990011]"
              }
            `}
          >
            <Icon />
            <span>{tItem.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default RoomsTabs
