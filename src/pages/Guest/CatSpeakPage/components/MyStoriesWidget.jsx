import React from "react"
import { Card, Avatar, Button, Typography, Skeleton } from "antd"
import { FiClock, FiTrash2 } from "react-icons/fi"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

const { Text, Paragraph } = Typography

const MyStoriesWidget = ({ stories, isLoading, onDelete, isDeleting }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {[1].map((i) => (
          <Card
            key={i}
            loading
            variant="borderless"
            className="rounded-2xl shadow-sm"
          />
        ))}
      </div>
    )
  }

  if (stories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-12 text-center">
        <div className="mb-2 text-4xl">🐱</div>
        <p className="text-gray-500">You haven't posted any stories yet.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {stories.map((story) => (
        <Card
          key={story.storyId}
          className="overflow-hidden rounded-2xl border-gray-200 shadow-sm"
          bordered={true}
        >
          <div className="flex items-start gap-4">
            <Avatar
              size={48}
              src={story.avatarImageUrl}
              className="bg-[#f08d1d]"
              icon={
                !story.avatarImageUrl && <span className="text-lg">👤</span>
              }
            >
              {story.username?.[0] || "Y"}
            </Avatar>
            <div className="flex-1">
              <div className="mb-1 flex items-center justify-between">
                <Text strong className="text-lg text-[#f08d1d]">
                  You
                </Text>
                <Text
                  type="secondary"
                  className="flex items-center gap-1 text-xs"
                >
                  <FiClock /> Expires {dayjs(story.expiresAt).fromNow()}
                </Text>
              </div>

              <Paragraph className="whitespace-pre-wrap text-base text-gray-700">
                {story.storyContent}
              </Paragraph>

              <div className="mt-4 flex items-center justify-end">
                <Button
                  danger
                  type="text"
                  icon={<FiTrash2 />}
                  onClick={() => onDelete(story.storyId)}
                  loading={isDeleting}
                  className="hover:bg-red-50"
                >
                  Delete Story
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default MyStoriesWidget
