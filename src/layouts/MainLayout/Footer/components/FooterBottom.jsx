import React from "react"
import { Link } from "react-router-dom"
import { useLanguage } from "@context/LanguageContext.jsx"

const FooterBottom = () => {
  const { t } = useLanguage()
  const footerText = t.footer

  return (
    <div className="w-full px-4 lg:px-12 lg:absolute lg:bottom-0 lg:left-0 lg:right-0">
      <div className="flex flex-col lg:flex-row items-center justify-between py-4 gap-4 lg:gap-0">
        {/* Left policies */}
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-8 text-yellow-300 text-sm text-center lg:text-left order-2 lg:order-1">
          <Link className="hover:text-yellow-400 transition">
            {footerText.policies.privacy}
          </Link>
          <Link className="hover:text-yellow-400 transition">
            {footerText.policies.terms}
          </Link>
        </div>

        {/* Center copyright */}
        <div className="text-gray-400 uppercase text-xs text-center flex-shrink-0 mx-4 order-3 lg:order-2">
          {footerText.copyright}
        </div>

        {/* Right policies */}
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-8 text-yellow-300 text-sm text-center lg:text-right order-1 lg:order-3">
          <Link className="hover:text-yellow-400 transition">
            {footerText.policies.payment}
          </Link>
          <Link className="hover:text-yellow-400 transition">
            {footerText.policies.copyright}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default FooterBottom
