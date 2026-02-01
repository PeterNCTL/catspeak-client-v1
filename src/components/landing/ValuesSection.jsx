import { useLanguage } from "@context/LanguageContext.jsx"
import { Typography } from "@mui/material"
import ValueCard from "./Values/ValueCard"
import DescriptionIcon from "@mui/icons-material/Description"
import PublicIcon from "@mui/icons-material/Public"
import SendIcon from "@mui/icons-material/Send" // Using Send as a proxy for the paper plane/launch feeling

const ValuesSection = () => {
  const { t } = useLanguage()
  const BannerAI =
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"

  return (
    <div className="w-full py-24 lg:pt-32 px-8">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-12 flex flex-col items-center justify-center space-y-4">
          <Typography
            variant="subtitle1"
            className="font-bold uppercase text-gray-500"
          >
            {t.home.whyChooseUs}
          </Typography>
          <Typography
            variant="h3"
            component="h2"
            className="font-bold text-gray-900"
          >
            {t.home.valuesTitle}
          </Typography>
        </div>

        {/* Main Content Area - Orange Background */}
        <div className="relative mx-auto flex w-full flex-col justify-center overflow-hidden rounded-[40px] bg-gradient-to-r from-cath-red-600 via-orange-400 to-amber-300 p-8 shadow-2xl md:p-12">
          {/* Decorative Frames - Z-0 to stay behind */}
          <div className="pointer-events-none absolute -top-12 -left-12 z-0 h-[300px] w-[300px] rounded-[40px] border-2 border-white" />
          <div className="pointer-events-none absolute -bottom-8 left-1/2 z-0 h-24 w-[600px] -translate-x-1/2 rounded-[30px] border-2 border-white" />
          <div className="pointer-events-none absolute top-12 -right-12 z-0 h-40 w-40 rotate-12 rounded-[24px] border-2 border-white" />

          {/* Content Grid - Z-10 to stay on top */}
          <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left Side - Cards Area */}
            <div className="flex items-center justify-center">
              <div className="flex flex-row items-center gap-6">
                {/* Column 1: Tech & Personal */}
                <div className="flex flex-col gap-6">
                  <ValueCard
                    icon={
                      <DescriptionIcon
                        fontSize="large"
                        className="text-purple-500"
                      />
                    }
                    title={t.home.values.tech.title}
                    description={t.home.values.tech.description}
                    className="shadow-purple-500/20"
                  />
                  <ValueCard
                    icon={
                      <SendIcon
                        fontSize="large"
                        className="rotate-[-30deg] text-orange-400"
                      />
                    }
                    title={t.home.values.personal.title}
                    description={t.home.values.personal.description}
                    className="shadow-orange-400/20"
                  />
                </div>

                {/* Column 2: Global */}
                <div>
                  <ValueCard
                    icon={
                      <PublicIcon fontSize="large" className="text-blue-400" />
                    }
                    title={t.home.values.global.title}
                    description={t.home.values.global.description}
                    className="shadow-blue-400/20"
                  />
                </div>
              </div>
            </div>

            {/* Right Side - Dashboard Image */}
            <div className="flex items-center justify-center">
              <img
                src={BannerAI}
                alt="CatSpeak Dashboard"
                className="h-auto max-h-[500px] w-full rounded-2xl object-cover shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ValuesSection
