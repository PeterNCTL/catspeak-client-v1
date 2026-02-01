import React from "react"
import { Link } from "react-router-dom"
import { useLanguage } from "@context/LanguageContext.jsx"
import { Typography } from "@mui/material"

const FooterBottom = () => {
  const { t } = useLanguage()
  const footerText = t.footer
  const currentYear = new Date().getFullYear()

  return (
    <div className="w-full px-4 lg:px-12 lg:absolute lg:bottom-0 lg:left-0 lg:right-0">
      <div className="flex flex-col lg:flex-row items-center justify-between py-4 gap-4 lg:gap-0">
        {/* Left policies */}
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-8 text-yellow-300 text-center lg:text-left order-2 lg:order-1">
          <Link className="hover:text-yellow-400 transition">
            <Typography variant="caption" className="text-sm">
              {footerText.policies.privacy}
            </Typography>
          </Link>
          <Link className="hover:text-yellow-400 transition">
            <Typography variant="caption" className="text-sm">
              {footerText.policies.terms}
            </Typography>
          </Link>
        </div>

        {/* Center copyright */}
        <div className="text-gray-400 uppercase text-center flex-shrink-0 mx-4 order-3 lg:order-2">
          <Typography variant="caption" className="text-xs">
            {footerText.copyright.replace("{year}", currentYear)}
          </Typography>
        </div>

        {/* Right policies */}
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-8 text-yellow-300 text-center lg:text-right order-1 lg:order-3">
          <Link className="hover:text-yellow-400 transition">
            <Typography variant="caption" className="text-sm">
              {footerText.policies.payment}
            </Typography>
          </Link>
          <Link className="hover:text-yellow-400 transition">
            <Typography variant="caption" className="text-sm">
              {footerText.policies.copyright}
            </Typography>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default FooterBottom
