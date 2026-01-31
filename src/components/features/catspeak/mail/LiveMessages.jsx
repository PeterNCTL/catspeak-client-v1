import React, { useState } from "react"
import { FiSend, FiCheck, FiX } from "react-icons/fi"
import PassConfirmationModal from "./PassConfirmationModal"

const LiveMessages = ({
  stories = [],
  onSend,
  onInteract,
  inputValue = "",
  onChangeInput,
  userLetters = 0,
  totalLetters = 0,
}) => {
  const [storyToPass, setStoryToPass] = useState(null)
  const rows = [0, 1, 2]

  // If no stories, show a placeholder or nothing
  if (!stories || stories.length === 0) {
    return (
      <div className="relative my-6 w-full max-w-full overflow-hidden rounded-3xl bg-white/60 px-2 py-8 text-center">
        {/* Input area same as before */}
        <div className="flex items-center justify-between px-2 pb-3">
          <div className="flex items-center gap-2">
            <input
              value={inputValue}
              onChange={(e) => onChangeInput?.(e.target.value)}
              maxLength={200}
              placeholder="Be the first to say hello..."
              className="h-9 w-72 rounded-full border border-[#c38300]/70 px-4 text-sm outline-none focus:border-[#990011]"
            />
            <button
              type="button"
              onClick={() => onSend?.(inputValue)}
              className="text-[#990011] transition hover:scale-105"
              aria-label="Send message"
            >
              <FiSend className="h-5 w-5" />
            </button>
            <span className="text-xs text-gray-500">
              {inputValue.length} / 200
            </span>
          </div>
          <div className="text-xs text-gray-600">
            <span className="font-semibold">{userLetters}</span> yours |{" "}
            <span className="font-semibold">{totalLetters}</span> total
          </div>
        </div>
        <div className="mt-4 text-gray-400 italic">
          No stories yet. Start the conversation!
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
            placeholder="Type your story..."
            className="h-9 w-72 rounded-full border border-[#c38300]/70 px-4 text-sm outline-none focus:border-[#990011]"
          />
          <button
            type="button"
            onClick={() => onSend?.(inputValue)}
            className="text-[#990011] transition hover:scale-105"
            aria-label="Send message"
          >
            <FiSend className="h-5 w-5" />
          </button>
          <span className="text-xs text-gray-500">
            {inputValue.length} / 200
          </span>
        </div>
        <div className="text-xs text-gray-600">
          <span className="font-semibold">{userLetters}</span> yours |{" "}
          <span className="font-semibold">{totalLetters}</span> total
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
              animation: "live-marquee 40s linear infinite", // Slower animation
              animationDelay: `${rowIdx * -5}s`, // Stagger start times with negative delay for immediate fill
            }}
          >
            {/* Repeat messages enough times to fill width and loop smoothly */}
            {[...stories, ...stories, ...stories, ...stories].map(
              (story, idx) => (
                <div
                  key={`${rowIdx}-${idx}`}
                  className="group relative inline-block whitespace-nowrap rounded-full bg-[#990011] px-4 py-2 text-xs font-semibold text-white shadow transition-colors"
                >
                  <span className="block">{story.storyContent}</span>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 hidden items-center justify-center gap-2 rounded-full bg-black/40 backdrop-blur-sm group-hover:flex">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleConnect(story)
                      }}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#990011] shadow hover:scale-110"
                      title="Connect"
                    >
                      <FiCheck size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setStoryToPass(story)
                      }}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-gray-600 shadow hover:scale-110 hover:text-red-500"
                      title="Pass"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      ))}

      <PassConfirmationModal open={!!storyToPass} onResult={handlePassResult} />
    </div>
  )
}

export default LiveMessages
