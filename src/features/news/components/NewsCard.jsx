import React, { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Bookmark } from "lucide-react"
import placeholderImg from "@/shared/assets/images/news/placeholder.jpg"
import InDevelopmentModal from "@/shared/components/common/InDevelopmentModal"

const NewsCard = ({ news }) => {
  const navigate = useNavigate()
  const { lang } = useParams()
  const currentLang = lang || "en"

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCardClick = () => {
    navigate(`/${currentLang}/cat-speak/news/${news.postId}`)
  }

  const handleBookmarkClick = (e) => {
    e.stopPropagation()
    setIsModalOpen(true)
  }

  return (
    <div
      onClick={handleCardClick}
      className="group relative mb-4 overflow-hidden border border-[#E5E5E5] cursor-pointer rounded-[16px]"
    >
      <div className="relative w-full">
        <img
          src={news.media?.[0]?.mediaUrl || placeholderImg}
          alt={news.title}
          className="w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Bookmark Icon */}
        <div
          className="absolute right-2 top-2 z-20 transition-all duration-300"
          onClick={handleBookmarkClick}
        >
          <Bookmark
            className="drop-shadow-md transition-all duration-200 text-white hover:text-gray-200"
            size={32}
          />
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 transition-all duration-300">
          <h5 className="m-0 line-clamp-2 text-base font-bold drop-shadow-md text-white">
            {news.title}
          </h5>

          <div className="grid grid-rows-[0fr] text-white transition-[grid-template-rows] duration-300 group-hover:grid-rows-[1fr]">
            <div className="overflow-hidden">
              <div className="pt-2">
                <span className="block text-xs italic opacity-80 mb-1">
                  {new Date(news.createDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
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
