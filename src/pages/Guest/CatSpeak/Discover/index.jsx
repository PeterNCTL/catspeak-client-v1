import React from "react"
import { Typography } from "antd"

const { Title, Paragraph } = Typography

const DiscoverPage = () => {
  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm">
      <Title level={2}>Khám phá thế giới</Title>
      <Paragraph>
        Coming soon: Explore cultures, places, and people from around the world.
      </Paragraph>
    </div>
  )
}

export default DiscoverPage
