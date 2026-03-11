import React, { useState, useEffect, useCallback } from "react"
import {
  BubbleChevronLeft,
  BubbleChevronRight,
} from "@/shared/components/ui/button/index"
import { useLanguage } from "@/shared/context/LanguageContext"
import InDevelopmentModal from "@/shared/components/common/InDevelopmentModal"
import ChinaWorkshopModal from "./modals/ChinaWorkshopModal"
import { getWorkshopSlides } from "../data/workshopSlides"
import PillButton from "@/shared/components/ui/PillButton"


const WorkshopCarousel = ({ slides: propSlides = [] }) => {
  const { t } = useLanguage()
  const [modalType, setModalType] = useState(null) // 'china' or 'development'
  const [activeIndex, setActiveIndex] = useState(0)

  // Get slides from data utility
  const slides = getWorkshopSlides(t, propSlides)

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  // Autoplay
  useEffect(() => {
    if (!slides || slides.length <= 1) return
    const interval = setInterval(() => {
      handleNext()
    }, 5000)
    return () => clearInterval(interval)
  }, [handleNext, slides])

  if (!slides || slides.length === 0) return null

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-black/5 shadow-[0_20px_50px_rgba(0,0,0,0.2)] group h-[200px] sm:h-[240px] md:h-[260px] w-full">
        {/* Carousel Slides */}
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ${
              idx === activeIndex
                ? "opacity-100 z-10 pointer-events-auto"
                : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 md:px-8 text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.35)]">
              <div className="inline-flex flex-col gap-2 sm:gap-3 rounded-xl sm:rounded-2xl bg-black/45 px-4 py-3 sm:px-6 sm:py-4 backdrop-blur-[2px] w-fit">
                <p className="text-sm sm:text-base md:text-lg font-semibold uppercase whitespace-pre-line">
                  {slide.title || t.workshops.heroCarousel.comingSoonTitle}
                </p>
                <PillButton
                  onClick={() => setModalType(slide.modal || "development")}
                  bgColor="#f5c518"
                  textColor="#990011"
                  className="!h-9 !px-4 text-xs sm:text-sm font-semibold shadow"
                >
                  {slide.cta}
                </PillButton>
              </div>
            </div>
          </div>
        ))}

        {/* Custom Navigation Buttons & Dots */}
        {slides.length > 1 && (
          <>
            {/* Nav Buttons - Hidden on mobile, shown on hover (desktop) */}
            <div className="hidden sm:block absolute left-3 top-3 z-20 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
              <BubbleChevronLeft aria-label="Prev slide" onClick={handlePrev} />
            </div>
            <div className="hidden sm:block absolute right-3 bottom-10 z-20 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
              <BubbleChevronRight
                aria-label="Next slide"
                onClick={handleNext}
              />
            </div>

            {/* Pagination Dots */}
            <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-1.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === activeIndex
                      ? "w-5 bg-[#990011] opacity-100"
                      : "w-1.5 bg-white opacity-50 hover:opacity-75"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <ChinaWorkshopModal
        open={modalType === "china"}
        onClose={() => setModalType(null)}
        t={t}
      />

      <InDevelopmentModal
        open={modalType === "development"}
        onCancel={() => setModalType(null)}
      />
    </>
  )
}

export default WorkshopCarousel
