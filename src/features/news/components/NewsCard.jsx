import React from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Typography } from "antd"
import { FaBookmark } from "react-icons/fa"

const { Title, Text } = Typography

const NewsCard = ({ news }) => {
  const navigate = useNavigate()
  const { lang } = useParams()
  const currentLang = lang || "en"

  const handleCardClick = () => {
    navigate(`/${currentLang}/cat-speak/news/${news.id}`)
  }

  return (
    <div
      onClick={handleCardClick}
      className="group relative mb-6 break-inside-avoid overflow-hidden bg-white shadow-sm transition-all duration-300 hover:shadow-md border border-[#E5E5E5] hover:border-[#990011] cursor-pointer"
      style={{
        borderRadius: "20px",
      }}
    >
      {/* Image Container - Full height/width of the card, determined by image aspect ratio */}
      <div className="relative w-full">
        <img
          src={news.image}
          alt={news.title}
          className="w-full object-cover" // Removed hover:scale
        />

        {/* Dark Overlay - Fades in on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Bookmark Icon */}
        <div
          className="absolute right-4 top-4 z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <FaBookmark
            className="text-4xl text-[#bd0000] drop-shadow-md hover:scale-110 transition-transform duration-200"
            style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
          />
        </div>

        {/* Content Container - Positioned at bottom, slides up/expands on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 transition-all duration-300">
          <Title
            level={5}
            className="!m-0 line-clamp-2 !text-lg !font-bold drop-shadow-md"
            style={{ color: "#E5E5E5" }}
          >
            {news.title}
          </Title>

          <div className="grid grid-rows-[0fr] text-white transition-[grid-template-rows] duration-300 group-hover:grid-rows-[1fr]">
            <div className="overflow-hidden">
              <div className="pt-2">
                <span className="block text-xs italic opacity-80 mb-1">
                  {news.date}
                </span>
                <Text className="text-gray-200 line-clamp-2 text-sm">
                  {news.description}
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsCard
