import { BannerAIVI, BannerAIEN } from "@assets/images/home"
import { useLanguage } from "@context/LanguageContext.jsx"
import LiquidGlassButton from "@components/LiquidGlassButton"

const AISection = () => {
  const { t, language } = useLanguage()
  const BannerAI = language === "en" ? BannerAIEN : BannerAIVI

  return (
    <div className="mt-12 md:mt-24 w-full px-4 md:px-8 pb-16">
      <div className="mx-auto max-w-screen-xl grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 lg:items-center">
        {/* Left Side - Banner Image */}
        <div className="relative order-2 lg:order-1">
          <img
            src={BannerAI}
            alt="AI Learning Platform"
            className="w-full h-auto"
          />
        </div>

        {/* Right Side - Content */}
        <div className="flex flex-col justify-center space-y-6 order-1 lg:order-2">
          {/* Header */}
          <div className="relative inline-block pb-2">
            <div className="text-sm uppercase tracking-wider text-gray-500 font-bold">
              {t.home.aiSection.header}
            </div>
            <div
              className="absolute bottom-0 left-0 h-0.5 bg-cath-red-800"
              style={{ width: "20%" }}
            />
          </div>

          {/* Title */}
          <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
            {t.home.aiSection.title}
          </div>

          {/* Main Heading */}
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 leading-tight">
            {t.home.aiSection.mainHeading}
          </h2>

          {/* Description */}
          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            {t.home.aiSection.description}
          </p>

          {/* Features List */}
          <ul className="space-y-4">
            {t.home.aiSection.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-base md:text-lg text-gray-700 flex-1">
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          {/* Call to Action Button */}
          <div className="pt-4">
            <LiquidGlassButton
              variant="yellow"
              className="rounded-[999px] px-8 py-4 text-base font-semibold text-white"
            >
              {t.home.aiSection.learnMore}
            </LiquidGlassButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AISection
