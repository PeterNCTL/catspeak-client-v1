import React from "react"
import { Typography, message, Tag } from "antd"
import dayjs from "dayjs"
import { useLanguage } from "@/context/LanguageContext"
import {
  useGetStoriesQuery,
  useGetMyStoriesQuery,
  useCreateStoryMutation,
  useInteractWithStoryMutation,
  useDeleteStoryMutation,
} from "@/store/api/storiesApi"
import StoryFeed from "./components/StoryFeed"
import CreateStoryWidget from "./components/CreateStoryWidget"
import MyStoriesWidget from "./components/MyStoriesWidget"
import TipsWidget from "./components/TipsWidget"

const { Title, Text } = Typography

const CatSpeakPage = () => {
  const { t } = useLanguage()

  // API Hooks
  const { data: storiesData, isLoading: loadingStories } = useGetStoriesQuery()
  const { data: myStoriesData, isLoading: loadingMyStories } =
    useGetMyStoriesQuery()
  const [createStory, { isLoading: isCreating }] = useCreateStoryMutation()
  const [interactWithStory] = useInteractWithStoryMutation()
  const [deleteStory, { isLoading: isDeleting }] = useDeleteStoryMutation()

  // Safe Data Extraction
  const stories = storiesData?.data ?? []
  const myStoriesRaw = myStoriesData?.data ?? []

  console.log(stories)

  // Filter out expired stories
  const myStories = myStoriesRaw.filter((story) => {
    return dayjs(story.expiresAt).isAfter(dayjs())
  })

  // Derived State
  const canCreate = myStories.length < 2

  // Handlers
  const handleCreate = async (content) => {
    if (!canCreate) {
      message.warning("You can only have 2 active stories at a time.")
      return
    }

    try {
      await createStory({ storyContent: content }).unwrap()
      message.success("Story posted successfully!")
    } catch (error) {
      message.error("Failed to post story.")
    }
  }

  const handleInteract = async (storyId, actionType) => {
    // actionType: 1 = Accept/Interest, 0 = Decline/Ignore
    try {
      await interactWithStory({ storyId, action: actionType }).unwrap()
      if (actionType === 1) {
        message.success("Interest sent! Check your messages.")
      } else {
        message.info("Story hidden.")
      }
    } catch (error) {
      message.error("Interaction failed.")
    }
  }

  const handleDelete = async (storyId) => {
    try {
      await deleteStory(storyId).unwrap()
      message.success("Story deleted.")
    } catch (error) {
      message.error("Failed to delete story.")
    }
  }

  return (
    <div className="min-h-screen w-full py-8">
      <div className="mx-auto grid max-w-screen-xl gap-8 px-4 md:grid-cols-[1fr_350px] lg:px-8">
        {/* LEFT COLUMN: PUBLIC FEED */}
        <div className="flex flex-col gap-10">
          {/* MY STORIES SECTION */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <Title level={2} className="!mb-0 !font-black !text-gray-900">
                My Stories
              </Title>
              <Tag
                color="red"
                className="rounded-full border-none bg-red-50 px-3 py-1 text-sm font-bold text-[#990011]"
              >
                {myStories.length}/2
              </Tag>
            </div>
            <MyStoriesWidget
              stories={myStories}
              isLoading={loadingMyStories}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
          </div>

          <div className="h-px w-full bg-gray-100" />

          {/* COMMUNITY STORIES SECTION */}
          <div className="flex flex-col gap-6">
            <div className="mb-2">
              <Title level={2} className="!mb-0 !font-black !text-gray-900">
                Community Stories
              </Title>
              <Text type="secondary" className="text-lg">
                Discover what others are talking about.
              </Text>
            </div>

            <StoryFeed
              stories={stories}
              isLoading={loadingStories}
              onInteract={handleInteract}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: MY DASHBOARD */}
        <div className="flex flex-col gap-6">
          <CreateStoryWidget
            onCreate={handleCreate}
            isCreating={isCreating}
            canCreate={canCreate}
            activeCount={myStories.length}
          />

          <TipsWidget />
        </div>
      </div>
    </div>
  )
}

export default CatSpeakPage
