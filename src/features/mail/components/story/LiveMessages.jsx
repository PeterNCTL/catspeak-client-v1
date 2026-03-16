import React, { useState } from "react"
import { Send, Check, X } from "lucide-react"
import PassConfirmationModal from "./PassConfirmationModal"
import MyStoryModal from "./MyStoryModal"
import { useLanguage } from "@/shared/context/LanguageContext"

const LiveMessages = ({
  stories = [],
  myStories = [],
  onSend,
  onInteract,
  onDeleteStory,
  inputValue = "",
  onChangeInput,
  userLetters = 0,
  totalLetters = 0,
}) => {
  const { t } = useLanguage()
  const [storyToPass, setStoryToPass] = useState(null)
  const [selectedMyStory, setSelectedMyStory] = useState(null)
  const rows = [0, 1, 2]

  // Combine stories and myStories with isOwn flag
  const combinedStories = [
    ...stories.map((story) => ({ ...story, isOwn: false })),
    ...myStories.map((story) => ({ ...story, isOwn: true })),
  ]

  // Prepare marquee items
  let marqueeItems = []
  if (combinedStories && combinedStories.length > 0) {
    marqueeItems = [...combinedStories]
    while (marqueeItems.length < 15) {
      marqueeItems = [...marqueeItems, ...combinedStories]
    }
    // Double for seamless loop
    marqueeItems = [...marqueeItems, ...marqueeItems]
  }

  // If no stories, show a placeholder or nothing
  if (!combinedStories || combinedStories.length === 0) {
    return (
      <div className="relative my-6 w-full max-w-full overflow-hidden rounded-3xl bg-white/60 px-2 py-8 text-center">
        {/* Input area same as before */}
        <div className="flex items-center justify-between px-2 pb-3">
          <div className="flex items-center gap-2">
            <input
              value={inputValue}
              onChange={(e) => onChangeInput?.(e.target.value)}
              maxLength={200}
              placeholder={t.catSpeak.mail.placeholderEmpty}
              className="h-9 w-72 rounded-full border border-[#c38300]/70 px-4 text-sm outline-none focus:border-[#990011]"
            />
            <button
              type="button"
              onClick={() => onSend?.(inputValue)}
              className="text-[#990011] transition hover:scale-105"
              aria-label="Send message"
            >
              <Send size={20} />
            </button>
            <span className="text-xs text-gray-500">
              {inputValue.length} / 200
            </span>
          </div>
          <div className="text-xs text-gray-600">
            <span className="font-semibold">{userLetters}</span>{" "}
            {t.catSpeak.mail.yours} |{" "}
            <span className="font-semibold">{totalLetters}</span>{" "}
            {t.catSpeak.mail.total}
          </div>
        </div>
        <div className="mt-4 text-gray-400 italic">
          {t.catSpeak.mail.noStories}
        </div>
      </div>
    )
  }

  const handlePassResult = (confirmed) => {
    if (confirmed && storyToPass && onInteract) {
      onInteract(storyToPass.storyId, 2) // 2 = Decline/Pass
    }
    setStoryToPass(null)
  }

  const handleConnect = (story) => {
    if (onInteract) {
      onInteract(story.storyId, 1) // 1 = Connect/Accept
    }
  }

  return (
    <div className="relative my-6 w-full max-w-full overflow-hidden rounded-3xl bg-white/60 px-2 py-3">
      <div className="flex items-center justify-between px-2 pb-3">
        <div className=" flex items-center gap-2">
          <input
            value={inputValue}
            onChange={(e) => onChangeInput?.(e.target.value)}
            maxLength={200}
            placeholder={t.catSpeak.mail.placeholder}
            className="h-9 w-72 rounded-full border border-[#c38300]/70 px-4 text-sm outline-none focus:border-[#990011]"
          />
          <button
            type="button"
            onClick={() => onSend?.(inputValue)}
            className="text-[#990011] transition hover:scale-105"
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
          <span className="text-xs text-gray-500">
            {inputValue.length} / 200
          </span>
        </div>
        <div className="text-xs text-gray-600">
          <span className="font-semibold">{userLetters}</span>{" "}
          {t.catSpeak.mail.yours} |{" "}
          <span className="font-semibold">{totalLetters}</span>{" "}
          {t.catSpeak.mail.total}
        </div>
      </div>
      <style>
        {`
        @keyframes live-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-content {
           display: flex;
           width: max-content; /* Ensure container fits content */
        }
        .marquee-content:hover {
           animation-play-state: paused !important;
        }
        `}
      </style>
      {rows.map((rowIdx) => (
        <div
          key={rowIdx}
          className="flex items-center gap-3 py-1 overflow-hidden"
        >
          <div
            className="flex items-center gap-3 marquee-content"
            style={{
              animation: "live-marquee 120s linear infinite", // Slower animation
              animationDelay: `${rowIdx * -5}s`, // Stagger start times with negative delay for immediate fill
            }}
          >
            {/* Repeat messages enough times to fill width and loop smoothly */}
            {marqueeItems.map((story, idx) => (
              <div
                key={`${rowIdx}-${idx}`}
                onClick={() => {
                  if (story.isOwn) {
                    setSelectedMyStory(story)
                  }
                }}
                className={`group relative inline-block whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold text-white shadow transition-colors ${
                  story.isOwn
                    ? "bg-blue-600 cursor-pointer hover:bg-blue-700"
                    : "bg-[#990011]"
                }`}
              >
                <span className="block">{story.storyContent}</span>

                {/* Hover Overlay - Only for other people's stories */}
                {!story.isOwn && (
                  <div className="absolute inset-0 hidden items-center justify-center gap-2 rounded-full bg-black/40 backdrop-blur-sm group-hover:flex">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleConnect(story)
                      }}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#990011] shadow hover:scale-110"
                      title={t.catSpeak.connect}
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setStoryToPass(story)
                      }}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-gray-600 shadow hover:scale-110 hover:text-red-500"
                      title={t.catSpeak.pass}
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <PassConfirmationModal open={!!storyToPass} onResult={handlePassResult} />
      <MyStoryModal
        open={!!selectedMyStory}
        story={selectedMyStory}
        onClose={() => setSelectedMyStory(null)}
        onDelete={onDeleteStory}
      />
    </div>
  )
}

export default LiveMessages
