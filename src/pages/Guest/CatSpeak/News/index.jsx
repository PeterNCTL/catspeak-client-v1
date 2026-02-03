import React from "react"
import { Typography } from "antd"
import { useLanguage } from "@context/LanguageContext"

const { Title, Paragraph } = Typography

const NewsPage = () => {
  const { t } = useLanguage()

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm">
      <Title level={2}>{t.catSpeak.news.title}</Title>
      <Paragraph>{t.catSpeak.news.description}</Paragraph>
    </div>
  )
}

export default NewsPage
