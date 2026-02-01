import { useLanguage } from "@context/LanguageContext.jsx"
import { Typography } from "@mui/material"
import ValueCard from "./Values/ValueCard"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import GroupsIcon from "@mui/icons-material/Groups"
import HubIcon from "@mui/icons-material/Hub"
import ChatIcon from "@mui/icons-material/Chat"

const ValuesSection = () => {
  const { t } = useLanguage()
  const BannerAI =
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"

  return (
    <div className="w-full py-12 sm:py-16 md:py-20 lg:py-24 lg:pt-32 px-4 sm:px-6 md:px-8">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-10 md:mb-12 flex flex-col items-center justify-center space-y-2 sm:space-y-3 md:space-y-4">
          <Typography
            variant="subtitle1"
            className="font-bold uppercase text-gray-500"
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
            }}
          >
            {t.home.whyChooseUs}
          </Typography>
          <Typography
            variant="h3"
            component="h2"
            className="font-bold text-gray-900 text-center"
            sx={{
              fontSize: {
                xs: "1.5rem",
                sm: "1.875rem",
                md: "2.25rem",
                lg: "3rem",
              },
            }}
          >
            {t.home.valuesTitle}
          </Typography>
        </div>

        {/* Main Content Area - Orange Background */}
        <div className="relative mx-auto flex w-full flex-col justify-center overflow-hidden rounded-[24px] sm:rounded-[32px] md:rounded-[40px] bg-gradient-to-r from-cath-red-600 via-orange-400 to-amber-300 p-4 sm:p-6 md:p-8 lg:p-12 shadow-2xl">
          {/* Decorative Frames - Z-0 to stay behind - Hidden on mobile */}
          <div className="pointer-events-none absolute -top-12 -left-12 z-0 h-[300px] w-[300px] rounded-[40px] border-2 border-white hidden lg:block" />
          <div className="pointer-events-none absolute -bottom-8 left-1/2 z-0 h-24 w-[600px] -translate-x-1/2 rounded-[30px] border-2 border-white hidden md:block" />
          <div className="pointer-events-none absolute top-12 -right-12 z-0 h-40 w-40 rotate-12 rounded-[24px] border-2 border-white hidden lg:block" />

          {/* Content Grid - Z-10 to stay on top */}
          <div className="relative z-10 grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2">
            {/* Left Side - Cards Area */}
            <div className="flex items-center justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Card 1: Practice-first */}
                <ValueCard
                  icon={
                    <PlayArrowIcon
                      fontSize="large"
                      className="text-purple-500"
                    />
                  }
                  title={t.home.values.practice.title}
                  description={t.home.values.practice.description}
                  className="shadow-purple-500/20"
                />

                {/* Card 2: Community-driven */}
                <ValueCard
                  icon={
                    <GroupsIcon fontSize="large" className="text-blue-400" />
                  }
                  title={t.home.values.community.title}
                  description={t.home.values.community.description}
                  className="shadow-blue-400/20"
                />

                {/* Card 3: Expand Networking */}
                <ValueCard
                  icon={
                    <HubIcon fontSize="large" className="text-orange-400" />
                  }
                  title={t.home.values.networking.title}
                  description={t.home.values.networking.description}
                  className="shadow-orange-400/20"
                />

                {/* Card 4: Real-life communication */}
                <ValueCard
                  icon={
                    <ChatIcon fontSize="large" className="text-green-500" />
                  }
                  title={t.home.values.reallife.title}
                  description={t.home.values.reallife.description}
                  className="shadow-green-500/20"
                />
              </div>
            </div>

            {/* Right Side - Dashboard Image */}
            <div className="flex items-center justify-center">
              <img
                src={BannerAI}
                alt="CatSpeak Dashboard"
                className="h-auto max-h-[300px] sm:max-h-[400px] md:max-h-[500px] w-full rounded-xl sm:rounded-2xl object-cover shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ValuesSection
