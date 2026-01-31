import { Hero1VI, Hero1EN } from "@assets/images/home"
import { useLanguage } from "@context/LanguageContext.jsx"

const ValuesSection = () => {
  const { t, language } = useLanguage()
  const Hero1 = language === "en" ? Hero1EN : Hero1VI

  return (
    <div className="mt-12 md:mt-32 w-full px-4 md:px-8">
      <div className="mx-auto max-w-screen-xl">
        <div className="flex flex-col items-center justify-center space-y-4 mb-8">
          <div className="text-xl uppercase text-gray-500 font-bold">
            {t.home.whyChooseUs}
          </div>
          <div className="text-4xl font-bold text-gray-900">
            {t.home.valuesTitle}
          </div>
        </div>
        <img src={Hero1} alt="Cat Speak Values" className="w-full h-auto" />
      </div>
    </div>
  )
}

export default ValuesSection
