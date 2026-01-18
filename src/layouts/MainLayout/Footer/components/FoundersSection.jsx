import React from "react"
import { useLanguage } from "@context/LanguageContext.jsx"

const FoundersSection = () => {
  const { t } = useLanguage()
  const footerText = t.footer

  const founders = [
    {
      name: "Nguyễn Ngọc Diễm Quỳnh",
      role: "Founder/CEO",
    },
    {
      name: "Nguyễn Phạm Đăng Quang",
      role: "CTO",
    },
    {
      name: "Nguyễn Ngọc Gia Hân",
      role: "CSMO",
    },
  ]

  return (
    <div className="col-span-1 lg:col-span-5 flex flex-col items-center">
      <div className="font-bold text-lg uppercase tracking-wide mb-8">
        {footerText.foundingTeam}
      </div>
      <div className="flex flex-col gap-6 w-full max-w-[340px] mx-auto px-4">
        {founders.map((founder, index) => (
          <div
            key={index}
            className={`flex items-center gap-4 ${
              index % 2 !== 0 ? "flex-row-reverse text-right" : "text-left"
            }`}
          >
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-2 border-white/50 bg-white/20">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  founder.name,
                )}&background=random`}
                alt={founder.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div
              className={`flex flex-col ${
                index % 2 !== 0 ? "items-end" : "items-start"
              }`}
            >
              <span className="font-bold text-sm leading-tight">
                {founder.name}
              </span>
              <span className="text-xs text-white/80 font-medium italic mt-0.5">
                {founder.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FoundersSection
