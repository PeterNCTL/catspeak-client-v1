import { useLanguage } from "@/shared/context/LanguageContext"

const IntellectualPropertyPolicy = () => {
  const { t } = useLanguage()

  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <p className="text-lg text-gray-600 font-medium">{t.comingSoon.badge}</p>
    </div>
  )
}

export default IntellectualPropertyPolicy
