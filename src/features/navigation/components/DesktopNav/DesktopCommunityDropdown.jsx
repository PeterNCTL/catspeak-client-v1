import React, { useEffect, useState, useRef } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { ChevronDown } from "lucide-react"
import { useLanguage } from "@/shared/context/LanguageContext"
import { useActiveLink } from "../../hooks/useActiveLink"
import { LANGUAGE_CONFIG } from "../../config/languages"
import LanguageMenuItem from "./LanguageMenuItem"

const DesktopCommunityDropdown = ({ navKey }) => {
  const { t } = useLanguage()
  const location = useLocation()
  const navigate = useNavigate()
  const { lang } = useParams()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const isActive = useActiveLink(navKey)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Helper to get label from config
  const getLabel = (code) => {
    const config = LANGUAGE_CONFIG.find((c) => c.code === code)
    return (
      t.header?.countries?.[config?.labelKey] || config?.fallbackLabel || "Anh"
    )
  }

  // Initialize label state
  const [selectedLabel, setSelectedLabel] = useState(() => {
    const savedLang = localStorage.getItem("communityLanguage")
    return getLabel(savedLang || "zh")
  })

  // Sync label with URL param or localStorage
  useEffect(() => {
    const targetLang = lang || localStorage.getItem("communityLanguage") || "zh"
    const label = getLabel(targetLang)
    setSelectedLabel(label)

    // Only update localStorage if lang comes from URL
    if (lang) {
      localStorage.setItem("communityLanguage", lang)
    }
  }, [lang, t])

  const handleLanguageSelect = (newLang, label) => {
    setSelectedLabel(label)
    setIsOpen(false)

    const pathWithoutLang = location.pathname.replace(/^\/(en|zh|vi)/, "")

    // Determine if we should preserve the sub-path
    const shouldPreservePath =
      pathWithoutLang.startsWith("/community") ||
      pathWithoutLang.startsWith("/cat-speak")

    const targetPath = shouldPreservePath ? pathWithoutLang : "/community"
    navigate(`/${newLang}${targetPath}`)
  }

  const handleCommunityClick = () => {
    const currentLang =
      lang || localStorage.getItem("communityLanguage") || "zh"
    navigate(`/${currentLang}/community`)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`flex items-center justify-center gap-1 min-w-[140px] px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-all duration-200 rounded-full cursor-pointer ${
          isOpen || isActive ? "text-white" : "text-white/70 hover:text-white"
        }`}
      >
        <span onClick={handleCommunityClick}>
          {selectedLabel || t.nav[navKey]}
        </span>
        <div className="relative ml-1">
          <div
            onClick={(e) => {
              e.stopPropagation()
              setIsOpen(!isOpen)
            }}
            className="flex items-center justify-center p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute left-1/2 top-[calc(100%+8px)] z-50 w-max -translate-x-1/2 rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none whitespace-nowrap">
              {/* Triangle arrow */}
              <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-white box-content border-t border-l border-black/5"></div>

              <div className="relative bg-white rounded-lg overflow-hidden">
                {LANGUAGE_CONFIG.map((config) => (
                  <LanguageMenuItem
                    key={config.code}
                    {...config}
                    label={
                      t.header?.countries?.[config.labelKey] ||
                      config.fallbackLabel
                    }
                    soonLabel={t.header?.soon || "Soon"}
                    onSelect={handleLanguageSelect}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DesktopCommunityDropdown
