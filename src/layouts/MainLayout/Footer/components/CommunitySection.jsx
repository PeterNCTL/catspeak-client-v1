import React from "react"
import { useLanguage } from "@context/LanguageContext.jsx"

const CommunitySection = ({ languages }) => {
  const { t } = useLanguage()
  const footerText = t.footer

  return (
    <div className="flex-1 text-center lg:text-left">
      <div className="font-bold text-lg uppercase tracking-wide">
        {footerText.ourCommunity}
      </div>
      <ul className="space-y-2 text-base pt-6 text-white/85 flex flex-col items-center lg:items-start">
        {languages.map((lang) => (
          <li key={lang} className="text-white font-bold drop-shadow-md">
            <span>{lang}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CommunitySection
