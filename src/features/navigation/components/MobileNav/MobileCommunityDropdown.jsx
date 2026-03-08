import React, { useState, useMemo } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { ChevronUp, ChevronDown } from "lucide-react"
import { useLanguage } from "@/shared/context/LanguageContext"
import { useActiveLink } from "../../hooks/useActiveLink"
import { LANGUAGE_CONFIG } from "../../config/languages"
import MobileLanguageItem from "./MobileLanguageItem"

const DEFAULT_COMMUNITY = "zh"

const MobileCommunityDropdown = ({ navKey, onClose }) => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { lang } = useParams()
  const location = useLocation()
  const isActive = useActiveLink(navKey)

  const [communityOpen, setCommunityOpen] = useState(false)

  // ---- Supported codes (scalable) ----
  const supportedCodes = useMemo(
    () => LANGUAGE_CONFIG.map((c) => c.code),
    []
  )

  // ---- Determine current community ----
  const currentCommunity = useMemo(() => {
    if (supportedCodes.includes(lang)) {
      localStorage.setItem("communityLanguage", lang)
      return lang
    }

    return (
      localStorage.getItem("communityLanguage") || DEFAULT_COMMUNITY
    )
  }, [lang, supportedCodes])

  // ---- Display label ----
  const displayLabel = useMemo(() => {
    const config = LANGUAGE_CONFIG.find(
      (c) => c.code === currentCommunity
    )

    return (
      t.header?.countries?.[config?.labelKey] ||
      config?.fallbackLabel ||
      t.nav?.[navKey]
    )
  }, [currentCommunity, t, navKey])

  // ---- Navigate to community root ----
  const handleNavigateClick = () => {
    navigate(`/${currentCommunity}/community`)
    onClose?.()
  }

  // ---- Switch community ----
  const handleCommunitySelect = (newCode) => {
    if (newCode === currentCommunity) {
      setCommunityOpen(false)
      return
    }

    localStorage.setItem("communityLanguage", newCode)
    setCommunityOpen(false)

    const isInsideEcosystem =
      location.pathname.startsWith(`/${currentCommunity}/community`) ||
      location.pathname.startsWith(`/${currentCommunity}/cat-speak`)

    if (isInsideEcosystem) {
      const newPath = location.pathname.replace(
        `/${currentCommunity}`,
        `/${newCode}`
      )
      navigate(newPath)
    } else {
      navigate(`/${newCode}/community`)
    }

    onClose?.()
  }

  return (
    <div className="flex flex-col">
      <div
        className={`flex items-center justify-between w-full min-h-[36px] rounded-[5px] transition-colors ${
          isActive || communityOpen
            ? "bg-[#F2F2F2]"
            : "hover:bg-[#F2F2F2]"
        }`}
      >
        {/* Navigate button */}
        <button
          onClick={handleNavigateClick}
          className={`flex-grow h-full px-3 py-2 flex items-center text-left ${
            isActive || communityOpen ? "text-[#990011]" : ""
          }`}
        >
          <span>{displayLabel}</span>
        </button>

        {/* Expand button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            setCommunityOpen((prev) => !prev)
          }}
          className={`px-3 py-2 h-full flex items-center justify-center ${
            isActive || communityOpen ? "text-[#990011]" : ""
          }`}
        >
          {communityOpen ? (
            <ChevronUp size={14} />
          ) : (
            <ChevronDown size={14} />
          )}
        </button>
      </div>

      {/* Collapse Container */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          communityOpen
            ? "max-h-[500px] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-1 mt-1">
          {LANGUAGE_CONFIG.map((config) => (
            <MobileLanguageItem
              key={config.code}
              {...config}
              label={
                t.header?.countries?.[config.labelKey] ||
                config.fallbackLabel
              }
              soonLabel={t.header?.soon || "Soon"}
              isActive={currentCommunity === config.code}
              onSelect={() =>
                handleCommunitySelect(config.code)
              }
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default MobileCommunityDropdown