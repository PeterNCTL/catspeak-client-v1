import { VietNam, China, USA } from "@assets/icons/flags"
import { useLanguage } from "@context/LanguageContext.jsx"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import InDevelopmentModal from "@/components/common/InDevelopmentModal"

const LanguageBar = () => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [isDevModalOpen, setIsDevModalOpen] = useState(false)

  const languages = [
    {
      flag: VietNam,
      name: t.home.countries.vietnam,
      code: "vi",
      param: "vietnamese",
    },
    { flag: China, name: t.home.countries.china, code: "cn", param: "chinese" },
    { flag: USA, name: t.home.countries.usa, code: "en", param: "english" },
  ]

  const handleNavigation = (param) => {
    if (param === "vietnamese") {
      setIsDevModalOpen(true)
    } else {
      navigate(`/community?language=${param}`)
    }
  }

  return (
    <div className="relative z-10 mt-4 px-4 sm:mt-6 sm:px-6 md:absolute md:top-auto md:-bottom-14 md:mt-0 md:left-0 md:px-8">
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3 md:max-w-4xl">
        {languages.map((lang, idx) => (
          <div
            key={lang.code}
            onClick={() => handleNavigation(lang.param)}
            className={`relative flex items-center gap-3 sm:gap-4 rounded-[12px] sm:rounded-[16px] bg-white p-4 sm:p-5 shadow-[0_12px_30px_rgba(0,0,0,0.12)] transition hover:shadow-xl cursor-pointer ${
              idx === 0 ? "md:ml-6" : ""
            }`}
          >
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center overflow-hidden rounded-full bg-white">
              <img
                src={lang.flag}
                alt={lang.name}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="text-base sm:text-lg font-semibold text-gray-800">
              {lang.name}
            </span>
          </div>
        ))}
      </div>
      <InDevelopmentModal
        open={isDevModalOpen}
        onCancel={() => setIsDevModalOpen(false)}
      />
    </div>
  )
}

export default LanguageBar
