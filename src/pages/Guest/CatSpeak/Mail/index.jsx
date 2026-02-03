import React, { useState } from "react"
import { message } from "antd"
import dayjs from "dayjs"
import { useLanguage } from "@/context/LanguageContext"
import {
  useGetStoriesQuery,
  useGetMyStoriesQuery,
  useCreateStoryMutation,
  useInteractWithStoryMutation,
} from "@/store/api/storiesApi"
import LiveMessages from "@/components/cat-speak/mail/LiveMessages"

const MailPage = () => {
  const { t } = useLanguage()
  const [inputValue, setInputValue] = useState("")

  // API Hooks
  const { data: storiesData, isLoading: loadingStories } = useGetStoriesQuery()
  const { data: myStoriesData, isLoading: loadingMyStories } =
    useGetMyStoriesQuery()
  const [createStory, { isLoading: isCreating }] = useCreateStoryMutation()
  const [interactWithStory] = useInteractWithStoryMutation()

  // Safe Data Extraction
  const stories = storiesData?.data ?? []
  const myStoriesRaw = myStoriesData?.data ?? []

  // Filter out expired stories
  const myStories = myStoriesRaw.filter((story) => {
    return dayjs(story.expiresAt).isAfter(dayjs())
  })

  // Derived State
  const canCreate = myStories.length < 2

  // Handlers
  const handleCreate = async (content) => {
    if (!content.trim()) return

    if (!canCreate) {
      message.warning("You can only have 2 active stories at a time.")
      return
    }

    try {
      await createStory({ storyContent: content }).unwrap()
      message.success("Story posted successfully!")
      setInputValue("")
    } catch (error) {
      message.error("Failed to post story.")
    }
  }

  const handleInteract = async (storyId, actionType) => {
    // actionType: 1 = Accept/Interest, 0 = Decline/Ignore
    try {
      await interactWithStory({ storyId, action: actionType }).unwrap()
    } catch (error) {
      if (error?.status === 409) {
        message.warning(t.catSpeak.alreadyInteracted)
      } else {
        console.error("Interaction failed:", error)
        message.error(t.catSpeak.interactionFailed)
      }
    }
  }

  return (
    <div className="w-full">
      <LiveMessages
        stories={stories}
        inputValue={inputValue}
        onChangeInput={setInputValue}
        onSend={handleCreate}
        onInteract={handleInteract}
        userLetters={myStories.length}
        totalLetters={stories.length}
      />
    </div>
  )
}

export default MailPage
