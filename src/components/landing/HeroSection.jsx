import { HoGuomBaner } from "@assets/images/home"
import { useLanguage } from "@context/LanguageContext.jsx"
import LiquidGlassButton from "@components/LiquidGlassButton"
import useAuth from "@/hooks/useAuth"
import { Typography } from "@mui/material"

const HeroSection = ({ openAuthModal }) => {
  const { t } = useLanguage()
  const { isAuthenticated } = useAuth()

  return (
    <div className="w-full px-8">
      <div className=" relative mx-auto overflow-visible rounded-[32px] bg-gradient-to-b from-cath-red-500 via-cath-red-700 to-[#f08d1d] p-6 md:p-12 drop-shadow-[0_20px_30px_rgba(0,0,0,0.15)]">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Side - Banner Image */}
          <div className="relative">
            {/* Decorative white frame at bottom left (similar to design) - Moved behind image */}
            <div className="pointer-events-none absolute -left-6 -bottom-6 h-20 w-28 rounded-[20px] border-2 border-white" />

            {/* Image Card */}
            <div className="relative aspect-video overflow-hidden rounded-[28px]">
              {/* Main Image */}
              <img
                src={HoGuomBaner}
                alt="Hoàn Kiếm Lake"
                className="w-full h-full object-cover"
              />

              {/* Action buttons, hide if user is logged in */}
              {!isAuthenticated && (
                <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col-reverse gap-3 sm:flex-row-reverse sm:gap-4">
                  <LiquidGlassButton
                    onClick={() => openAuthModal("login")}
                    variant="default"
                    className="w-full flex-1 rounded-[999px] px-6 py-3 text-sm font-semibold text-white sm:w-auto sm:max-w-[220px]"
                  >
                    {t.auth.loginButton}
                  </LiquidGlassButton>
                  <LiquidGlassButton
                    onClick={() => openAuthModal("register")}
                    variant="yellow"
                    className="w-full flex-1 rounded-[999px] px-6 py-3 text-sm font-semibold text-white sm:w-auto sm:max-w-[220px]"
                  >
                    {t.auth.registerButton}
                  </LiquidGlassButton>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Text Content */}
          <div className="flex items-center h-full">
            <div className="flex aspect-video w-full flex-col justify-center gap-6 rounded-[24px] border-2 border-white/30 bg-white/10 p-8 backdrop-blur-sm lg:p-12">
              <Typography
                variant="h3"
                component="h1"
                className="font-black leading-tight text-[#f4ab1b]"
                sx={{
                  fontSize: { xs: "1.875rem", lg: "2.25rem", xl: "3rem" },
                }}
              >
                {t.home.heroTitle}
              </Typography>
              <Typography
                variant="body1"
                component="p"
                className="leading-relaxed text-white"
                sx={{
                  fontSize: { xs: "1.125rem", lg: "1.25rem" },
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
