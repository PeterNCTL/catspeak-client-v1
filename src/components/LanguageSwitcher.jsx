import React, { useState } from "react"
import { Dropdown } from "antd"
import { FiChevronDown } from "react-icons/fi"
import { useLanguage } from "../context/LanguageContext"

const LanguageSwitcher = ({ className = "" }) => {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const items = [
    {
      key: "vi",
      label: (
        <div className="px-2 py-1.5">
          <span className="text-sm font-semibold text-gray-700">
            Tiếng Việt
          </span>
        </div>
      ),
      onClick: () => setLanguage("vi"),
    },
    {
      key: "cn",
      label: (
        <div className="px-2 py-1.5">
          <span className="text-sm font-semibold text-gray-700">
            Tiếng Trung
          </span>
        </div>
      ),
      onClick: () => setLanguage("cn"),
    },
    {
      key: "en",
      label: (
        <div className="px-2 py-1.5">
          <span className="text-sm font-semibold text-gray-700">Tiếng Anh</span>
        </div>
      ),
      onClick: () => setLanguage("en"),
    },
  ]

  const getDisplayLabel = () => {
    switch (language) {
      case "vi":
        return "Tiếng Việt"
      case "cn":
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
