import { useLanguage } from "@context/LanguageContext.jsx"
import LiquidGlassButton from "@components/LiquidGlassButton"
import { Typography } from "@mui/material"
import CheckIcon from "@mui/icons-material/Check"
import { colors } from "../../utils/colors"

const AISection = () => {
  const { t } = useLanguage()

  return (
    <div className="w-full px-4 py-12 md:px-8 lg:py-24 flex items-center">
      <div className="mx-auto grid max-w-screen-xl grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
        {/* Left Side - 3 Image Layout */}
        <div className="relative order-2 mx-auto h-[500px] w-full max-w-[500px] lg:order-1 lg:h-[600px] lg:max-w-[600px]">
          {/* Decorative Dots Top Right */}
          <div className="absolute -top-4 -right-4 flex gap-2">
            <div className="h-3 w-3 rounded-full bg-red-400"></div>
            <div className="h-3 w-3 rounded-full bg-red-400"></div>
            <div className="h-3 w-3 rounded-full bg-red-400"></div>
          </div>

          {/* Image 1: Group (Top Left) */}
          <div className="absolute left-0 top-0 z-10 w-[65%] overflow-hidden rounded-[40px] border-2 border-amber-400 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80"
              alt="Community"
              className="h-full w-full object-cover aspect-[4/5]"
            />
          </div>

          {/* Image 2: Laptop (Bottom Right) */}
          <div className="absolute bottom-0 right-0 z-20 w-[65%] overflow-hidden rounded-[40px] border-2 border-amber-400 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?auto=format&fit=crop&w=600&q=80"
              alt="AI Learning"
              className="h-full w-full object-cover aspect-[4/5]"
            />
          </div>

          {/* Image 3: Phone (Bottom Left) */}
          <div className="absolute bottom-12 left-4 z-30 w-[35%] overflow-hidden rounded-[30px] border-2 border-amber-400 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80"
              alt="Mobile Learning"
              className="h-full w-full object-cover aspect-square"
            />
          </div>

          {/* Speech Bubble */}
          <div className="absolute top-8 right-0 z-30 animate-bounce">
            <div className="relative rounded-[50px] rounded-bl-none bg-gradient-to-r from-orange-400 to-amber-500 px-8 py-4 shadow-xl">
              <Typography
                variant="h5"
                component="h3"
                className="font-bold text-white"
              >
                {t.home.aiSection.greeting}
              </Typography>
              <div className="absolute -bottom-2 left-0 h-6 w-6 bg-gradient-to-r from-orange-400 to-amber-500 [clip-path:polygon(0_0,100%_0,0_100%)]"></div>
            </div>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="order-1 flex flex-col justify-center space-y-6 lg:order-2">
          {/* Header */}
          <div className="relative inline-block pb-2">
            <Typography
              variant="caption"
              className="uppercase tracking-wider text-gray-500 font-bold block"
            >
              {t.home.aiSection.header}
            </Typography>
            <div
              className="absolute bottom-0 left-0 h-0.5 bg-cath-red-800"
              style={{ width: "20%" }}
            />
          </div>

          {/* Title */}
          <Typography
            variant="h3"
            component="div"
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900"
          >
            {t.home.aiSection.title}
          </Typography>

          {/* Main Heading */}
          <Typography
            variant="h4"
            component="h2"
            className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 leading-tight"
          >
            {t.home.aiSection.mainHeading}
          </Typography>

          {/* Description */}
          <Typography
            variant="body1"
            className="text-base md:text-lg text-gray-600 leading-relaxed"
          >
            {t.home.aiSection.description}
          </Typography>

          {/* Features List */}
          <ul className="space-y-4">
            {t.home.aiSection.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <CheckIcon sx={{ color: colors.red[800], fontSize: 20 }} />
                </div>
                <Typography
                  variant="body1"
                  component="span"
                  className="text-base md:text-lg text-gray-700 flex-1"
                >
                  {feature}
                </Typography>
              </li>
            ))}
          </ul>

          {/* Call to Action Button */}
          {/* <div className="pt-4">
            <LiquidGlassButton
              variant="yellow"
              className="rounded-[999px] px-8 py-4 text-base font-semibold text-white"
            >
              {t.home.aiSection.learnMore}
            </LiquidGlassButton>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default AISection
