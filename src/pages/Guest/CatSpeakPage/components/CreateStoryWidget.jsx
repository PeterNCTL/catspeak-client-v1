import React, { useState } from "react"
import { Card, Input, Button } from "antd"
import { FiEdit3, FiSend } from "react-icons/fi"

const { TextArea } = Input

const CreateStoryWidget = ({
  onCreate,
  isCreating,
  canCreate,
  activeCount,
}) => {
  const [content, setContent] = useState("")

  const handleSubmit = () => {
    if (!content.trim()) return
    onCreate(content)
    setContent("")
  }

  return (
    <Card
      className="rounded-2xl border-gray-200 shadow-sm"
      title={
        <div className="flex items-center gap-2">
          <FiEdit3 className="text-[#990011]" />
          <span className="font-bold">Create Story</span>
        </div>
      }
      bordered={true}
    >
      <div className="flex flex-col gap-10">
        <TextArea
          placeholder={
            canCreate
              ? "What's on your mind? (Expires in 48h)"
              : "You reached the limit of 2 active stories."
          }
          autoSize={{ minRows: 3, maxRows: 6 }}
          maxLength={500}
          showCount
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={!canCreate}
          className="rounded-xl border-gray-200 focus:border-[#990011] focus:shadow-none"
        />
        <div className="flex items-center justify-end">
          <Button
            type="primary"
            icon={<FiSend />}
            onClick={handleSubmit}
            loading={isCreating}
            disabled={!content.trim() || !canCreate}
            className="bg-[#990011] text-white"
          >
            Post
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default CreateStoryWidget
