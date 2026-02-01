import { HoGuomBaner } from "@assets/images/home"
import { useLanguage } from "@context/LanguageContext.jsx"
import LiquidGlassButton from "@components/LiquidGlassButton"
import useAuth from "@/hooks/useAuth"
import { Typography } from "@mui/material"

const HeroSection = ({ openAuthModal }) => {
  const { t } = useLanguage()
  const { isAuthenticated } = useAuth()

  return (
    <div className="w-full px-4 sm:px-6 md:px-8">
      <div className="relative mx-auto overflow-visible rounded-[24px] sm:rounded-[32px] bg-gradient-to-b from-cath-red-500 via-cath-red-700 to-[#f08d1d] p-4 sm:p-6 md:p-8 lg:p-12 drop-shadow-[0_20px_30px_rgba(0,0,0,0.15)]">
        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Side - Banner Image */}
          <div className="relative order-2 lg:order-1">
            {/* Decorative white frame at bottom left (similar to design) - Moved behind image */}
            <div className="pointer-events-none absolute -left-4 -bottom-4 sm:-left-6 sm:-bottom-6 h-16 w-24 sm:h-20 sm:w-28 rounded-[16px] sm:rounded-[20px] border-2 border-white hidden sm:block" />

            {/* Image Card */}
            <div className="relative aspect-video overflow-hidden rounded-[20px] sm:rounded-[28px]">
              {/* Main Image */}
              <img
                src={HoGuomBaner}
                alt="Hoàn Kiếm Lake"
                className="w-full h-full object-cover"
              />

              {/* Action buttons, hide if user is logged in */}
              {!isAuthenticated && (
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-20 flex flex-col gap-2 sm:flex-row-reverse sm:gap-3 md:gap-4">
                  <LiquidGlassButton
                    onClick={() => openAuthModal("login")}
                    variant="default"
                    className="w-full flex-1 rounded-[999px] px-4 py-2.5 sm:px-6 sm:py-3 text-sm font-semibold text-white sm:max-w-[220px]"
                  >
                    {t.auth.loginButton}
                  </LiquidGlassButton>
                  <LiquidGlassButton
                    onClick={() => openAuthModal("register")}
                    variant="yellow"
                    className="w-full flex-1 rounded-[999px] px-4 py-2.5 sm:px-6 sm:py-3 text-sm font-semibold text-white sm:max-w-[220px]"
                  >
                    {t.auth.registerButton}
                  </LiquidGlassButton>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Text Content */}
          <div className="flex items-center h-full order-1 lg:order-2">
            <div className="flex w-full flex-col justify-center gap-4 sm:gap-6 rounded-[20px] sm:rounded-[24px] border-2 border-white/30 bg-white/10 p-6 sm:p-8 lg:p-10 xl:p-12 backdrop-blur-sm">
              <Typography
                variant="h3"
                component="h1"
                className="font-black leading-tight text-[#f4ab1b]"
                sx={{
                  fontSize: {
                    xs: "1.5rem",
                    sm: "1.875rem",
                    lg: "2.25rem",
                    xl: "3rem",
                  },
                }}
              >
                {t.home.heroTitle}
              </Typography>
              <Typography
                variant="body1"
                component="p"
                className="leading-relaxed text-white"
                sx={{
                  fontSize: {
                    xs: "0.875rem",
                    sm: "1rem",
                    lg: "1.125rem",
                    xl: "1.25rem",
                  },
                }}
              >
                {t.home.heroSubtitle}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
