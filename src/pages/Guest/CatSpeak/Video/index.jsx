import React from "react"
import { Typography } from "antd"

const { Title, Paragraph } = Typography

const VideoPage = () => {
  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm">
      <Title level={2}>Video</Title>
      <Paragraph>
        Coming soon: Watch curated videos to improve your listening skills.
      </Paragraph>
    </div>
  )
}

export default VideoPage
