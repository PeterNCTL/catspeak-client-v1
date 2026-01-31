import React, { useState } from "react"
import { Dropdown } from "antd"
import { FiChevronDown } from "react-icons/fi"
import { useLanguage } from "@/context/LanguageContext"

import colors from "@/utils/colors"

const LanguageSwitcher = ({ className = "" }) => {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const getItemStyle = (key) => ({
    backgroundColor: language === key ? colors.primary2 : "transparent",
    borderRadius: "8px",
  })

  const items = [
    {
      key: "vi",
      style: getItemStyle("vi"),
      label: (
        <span className="text-sm font-semibold text-gray-700">
          Tiếng Việt (Quốc Ngữ)
        </span>
      ),
      onClick: () => setLanguage("vi"),
    },
    {
      key: "vi-nom",
      label: (
        <span className="text-sm font-semibold text-gray-400 cursor-not-allowed">
          Tiếng Việt (Nôm) - Sắp ra mắt
        </span>
      ),
      disabled: true,
    },
    {
      key: "zh",
      style: getItemStyle("zh"),
      label: (
        <span className="text-sm font-semibold text-gray-700">Tiếng Trung</span>
      ),
      onClick: () => setLanguage("zh"),
    },
    {
      key: "en",
      style: getItemStyle("en"),
      label: (
        <span className="text-sm font-semibold text-gray-700">Tiếng Anh</span>
      ),
      onClick: () => setLanguage("en"),
    },
  ]

  const getDisplayLabel = () => {
    switch (language) {
      case "vi":
        return "Tiếng Việt (Quốc Ngữ)"
      case "zh":
        return "Tiếng Trung"
      case "en":
        return "Tiếng Anh"
      default:
        return "Tiếng Việt"
    }
  }

  return (
    <Dropdown
      menu={{ items }}
      trigger={["hover"]}
      placement="bottomRight"
      onOpenChange={setIsOpen}
    >
      <div className={`flex items-center gap-2 cursor-pointer ${className}`}>
        <span className="font-bold text-[#FFB400] text-lg">
          {getDisplayLabel()}
        </span>
        <FiChevronDown
          className={`text-[#FFB400] text-xl transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>
    </Dropdown>
  )
}

export default LanguageSwitcher
