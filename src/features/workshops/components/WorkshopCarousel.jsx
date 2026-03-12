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
      <div className="mx-auto max-w-3xl w-full px-4 sm:px-6 md:px-8 lg:px-0">
        <div className="relative overflow-hidden rounded-xl bg-black/5 shadow-[0_20px_50px_rgba(0,0,0,0.2)] group aspect-video w-full">
          {/* Carousel Slides */}
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                idx === activeIndex
                  ? "opacity-100 z-10 pointer-events-auto"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="h-full w-full object-cover transform transition-transform duration-[2000ms] ease-out"
              />
              {/* Gradient Overlay for better legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent hidden md:block" />

              <div className="absolute inset-0 flex flex-col justify-end px-8 pb-20 text-white text-left">
                <div className="max-w-xl space-y-3 sm:space-y-5 animate-in fade-in slide-in-from-bottom-5 duration-700">
                  <div className="space-y-1.5 sm:space-y-2">
                    <h2 className="text-3xl font-bold drop-shadow-lg">
                      {slide.title || t.workshops.heroCarousel.comingSoonTitle}
                    </h2>
                    {slide.subtext && (
                      <p className="text-sm leading-relaxed">{slide.subtext}</p>
                    )}
                  </div>

                  <div className="pt-1.5">
                    <PillButton
                      onClick={() => setModalType(slide.modal || "development")}
                      bgColor="#f5c518"
                      textColor="#990011"
                    >
                      {slide.cta}
                    </PillButton>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Custom Navigation Buttons & Dots */}
          {slides.length > 1 && (
            <>
              {/* Nav Buttons - Shown on hover (desktop) */}
              <div className="hidden sm:block absolute left-6 top-1/2 -translate-y-1/2 z-20 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110">
                <BubbleChevronLeft
                  aria-label="Prev slide"
                  onClick={handlePrev}
                />
              </div>
              <div className="hidden sm:block absolute right-6 top-1/2 -translate-y-1/2 z-20 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110">
                <BubbleChevronRight
                  aria-label="Next slide"
                  onClick={handleNext}
                />
              </div>

              {/* Pagination Dots */}
              <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-3">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      idx === activeIndex
                        ? "w-8 bg-[#f5c518] shadow-[0_0_10px_rgba(245,197,24,0.5)]"
                        : "w-2 bg-white/40 hover:bg-white/60"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
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
