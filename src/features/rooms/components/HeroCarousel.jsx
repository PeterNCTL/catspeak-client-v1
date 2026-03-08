import React, { useRef } from "react"
import { Carousel, ConfigProvider } from "antd"
import {
  BubbleChevronLeft,
  BubbleChevronRight,
} from "@/shared/components/ui/button/index"
import { useLanguage } from "@/shared/context/LanguageContext"
import InDevelopmentModal from "@/shared/components/common/InDevelopmentModal"

const HeroCarousel = ({ slides }) => {
  const { t } = useLanguage()
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const carouselRef = useRef(null)

  const handlePrev = () => {
    carouselRef.current?.prev()
  }

  const handleNext = () => {
    carouselRef.current?.next()
  }

  return (
    <ConfigProvider
      theme={{
        components: {
          Carousel: {
            dotWidth: 6,
            dotHeight: 6,
            dotActiveWidth: 20, // Elongated active dot
          },
        },
      }}
    >
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-black/5 shadow-[0_20px_50px_rgba(0,0,0,0.2)] group">
        <Carousel
          ref={carouselRef}
          autoplay
          autoplaySpeed={5000}
          effect="fade"
          dots={{ className: "carousel-dots" }}
          className="rounded-2xl sm:rounded-3xl overflow-hidden"
        >
          {slides?.map((slide, idx) => (
            <div
              key={idx}
              className="relative h-[200px] sm:h-[240px] md:h-[260px] w-full"
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 md:px-8 text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.35)]">
                <div className="inline-flex flex-col gap-2 sm:gap-3 rounded-xl sm:rounded-2xl bg-black/45 px-4 py-3 sm:px-6 sm:py-4 backdrop-blur-[2px] w-fit">
                  <p className="text-sm sm:text-base md:text-lg font-semibold uppercase">
                    {t.rooms.heroCarousel.comingSoonTitle}
                  </p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex w-fit items-center gap-2 rounded-full bg-[#f5c518] px-4 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-semibold text-[#990011] shadow hover:bg-[#ffe066] transition-colors"
                  >
                    {slide.cta}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Carousel>

        {/* Custom Navigation Buttons - Overlaid - Hidden on mobile */}
        <div className="hidden sm:block absolute left-3 top-3 z-10 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
          <BubbleChevronLeft aria-label="Prev slide" onClick={handlePrev} />
        </div>
        <div className="hidden sm:block absolute right-3 bottom-10 z-10 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
          <BubbleChevronRight aria-label="Next slide" onClick={handleNext} />
        </div>

        <style>{`
          .carousel-dots li button {
            background-color: #fff !important;
            opacity: 0.5;
            border-radius: 999px !important;
          }
          .carousel-dots li.slick-active button {
            background-color: #990011 !important;
            opacity: 1;
          }
          @media (min-width: 640px) {
            .carousel-dots li.slick-active button {
              width: 20px !important;
            }
          }
        `}</style>
      </div>
      <InDevelopmentModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
      />
    </ConfigProvider>
  )
}

export default HeroCarousel
