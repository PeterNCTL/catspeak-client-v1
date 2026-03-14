import React, { useState, useMemo, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Bookmark } from "lucide-react"
import placeholderImg from "@/shared/assets/images/news/placeholder.jpg"
import InDevelopmentModal from "@/shared/components/common/InDevelopmentModal"
import { COLORS } from "@/shared/constants/constants"

const IMAGE_BASE_URL = "https://api.catspeak.com.vn"

const NewsCard = ({ news }) => {
  const navigate = useNavigate()
  const { lang } = useParams()
  const currentLang = lang || "en"

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)

  const handleCardClick = () => {
    navigate(`/${currentLang}/cat-speak/news/${news.postId}`)
  }

  const handleBookmarkClick = (e) => {
    e.stopPropagation()
    setIsModalOpen(true)
  }

  const hasMedia = news.media && news.media.length > 0

  useEffect(() => {
    if (hasMedia && news.media.length > 1) {
      const interval = setInterval(() => {
        setCurrentMediaIndex((prev) => (prev + 1) % news.media.length)
      }, 10000) // 10 seconds per image
      return () => clearInterval(interval)
    }
  }, [hasMedia, news.media?.length])

  const randomBackgroundColor = useMemo(() => {
    if (hasMedia) return null
    // Use postId as seed for stable random if possible, or just index
    const seed = news.postId || Math.floor(Math.random() * COLORS.length)
    const index =
      typeof seed === "number"
        ? seed % COLORS.length
        : seed.length % COLORS.length
    return COLORS[index].value
  }, [hasMedia, news.postId])

  const getPreviewText = (html) => {
    if (!html) return ""

    const div = document.createElement("div")
    div.innerHTML = html
    return div.textContent?.replace(/\s+/g, " ").trim() || ""
  }

  return (
    <div
      onClick={handleCardClick}
      className="group relative h-full overflow-hidden border cursor-pointer rounded-xl transition-all duration-300 border-[#C6C6C6] hover:border-[#990011] hover:shadow-md bg-white flex flex-col"
    >
      {/* Media/Upper Section */}
      <div className="relative w-full aspect-video overflow-hidden">
        {hasMedia ? (
          <div
            className="flex h-full transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${currentMediaIndex * 100}%)` }}
          >
            {news.media.map((item) => {
              const imageUrl = `${IMAGE_BASE_URL}${item.mediaUrl}`

              return (
                <div
                  key={item.postMediaId}
                  className="w-full h-full flex-shrink-0 relative"
                >
                  <img
                    src={imageUrl}
                    alt={news.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )
            })}
          </div>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: randomBackgroundColor }}
          >
            <span className="text-white/20 font-bold text-4xl select-none">
              Cat Speak
            </span>
          </div>
        )}

        {hasMedia && (
          <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        )}

        {/* Bookmark Icon */}
        <div
          className="absolute right-3 top-3 z-20 transition-all duration-300"
          onClick={handleBookmarkClick}
        >
          <Bookmark
            size={24}
            className={`drop-shadow-md transition-all duration-200 transform ${
              hasMedia
                ? "text-white hover:text-gray-200"
                : "text-white/80 hover:text-white"
            }`}
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h5 className="m-0 line-clamp-2 text-base font-bold text-[#990011] group-hover:text-[#990011] transition-colors duration-300 min-h-[3rem]">
          {news.title}
        </h5>

        <p className="line-clamp-2 text-sm leading-relaxed text-gray-600 mt-1">
          {getPreviewText(news.content)}
        </p>

        {/* Footer: Author (Left) & Date (Right) */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 text-sm text-[#7A7574]">
          <div className="flex items-center gap-2 truncate flex-1 mr-2">
            {news.avatarUrl ? (
              <img
                src={`${IMAGE_BASE_URL}${news.avatarUrl}`}
                alt={news.authorName}
                className="w-5 h-5 rounded-full object-cover border border-gray-100"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border border-gray-200">
                <span className="text-[9px] font-bold text-[#7A7574] uppercase">
                  {news.authorName?.charAt(0) || "C"}
                </span>
              </div>
            )}
            <span className="truncate max-w-[120px]">
              {news.authorName || "Cat Speak Admin"}
            </span>
          </div>

          <span className="whitespace-nowrap">
            {new Date(news.createDate).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      <InDevelopmentModal
        open={isModalOpen}
        onCancel={(e) => {
          if (e) e.stopPropagation()
          setIsModalOpen(false)
        }}
      />
    </div>
  )
}

export default NewsCard
