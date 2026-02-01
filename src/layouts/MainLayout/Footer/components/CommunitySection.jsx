import React from "react"
import { useLanguage } from "@context/LanguageContext.jsx"
import { Typography } from "@mui/material"

const CommunitySection = ({ languages }) => {
  const { t } = useLanguage()
  const footerText = t.footer

  return (
    <div className="flex-1 text-center lg:text-left">
      <Typography
        variant="subtitle1"
        className="font-bold uppercase tracking-wide"
      >
        {footerText.ourCommunity}
      </Typography>
      <ul className="space-y-2 pt-6 text-white/85 flex flex-col items-center lg:items-start">
        {languages.map((lang) => (
          <li key={lang} className="drop-shadow-md">
            <Typography variant="body1" className="text-white font-bold">
              {lang}
            </Typography>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CommunitySection
