import React from "react"
import { Typography } from "antd"
import { useLanguage } from "@/shared/context/LanguageContext"

import NewsCard from "../components/NewsCard"
import { newsData } from "../data/newsData"

const { Title, Paragraph } = Typography

const NewsPage = () => {
  const { t } = useLanguage()

  return (
    <div className="p-4 md:p-8">
      <div className="columns-1 gap-6 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6">
        {newsData.map((news) => (
          <NewsCard key={news.id} news={news} />
        ))}
      </div>
    </div>
  )
}

export default NewsPage
