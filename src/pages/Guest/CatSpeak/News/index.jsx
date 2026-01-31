import React from "react"
import { Typography } from "antd"

const { Title, Paragraph } = Typography

const NewsPage = () => {
  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm">
      <Title level={2}>News</Title>
      <Paragraph>Coming soon: Stay updated with the latest news.</Paragraph>
    </div>
  )
}

export default NewsPage
