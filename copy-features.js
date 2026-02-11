const fs = require("fs")
const path = require("path")

function copyFile(src, dest) {
  const destDir = path.dirname(dest)
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true })
  }
  fs.copyFileSync(src, dest)
  console.log(`Copied: ${src} -> ${dest}`)
}

// Waiting Room components
const waitingRoomFiles = [
  "MediaControls.jsx",
  "ParticipantList.jsx",
  "VideoPreview.jsx",
  "WaitingScreen.jsx",
]

waitingRoomFiles.forEach((file) => {
  copyFile(
    `src/components/waiting-room/${file}`,
    `src/features/waiting-room/components/${file}`,
  )
})

// Video Call components
const videoCallFiles = [
  "ChatBox.jsx",
  "ControlBar.jsx",
  "MicButton.jsx",
  "ParticipantList.jsx",
]

videoCallFiles.forEach((file) => {
  copyFile(
    `src/components/video-call/${file}`,
    `src/features/video-call/components/${file}`,
  )
})

// Video Call video components
copyFile(
  "src/components/video-call/video/VideoGrid.jsx",
  "src/features/video-call/components/video/VideoGrid.jsx",
)
copyFile(
  "src/components/video-call/video/VideoTile.jsx",
  "src/features/video-call/components/video/VideoTile.jsx",
)

// Video Call hooks
copyFile(
  "src/hooks/useVideoCall.js",
  "src/features/video-call/hooks/useVideoCall.js",
)
copyFile(
  "src/hooks/useAudioLevel.js",
  "src/features/video-call/hooks/useAudioLevel.js",
)

// Messages components
const messagesFiles = [
  "FloatingButton.jsx",
  "MessageModal.jsx",
  "MessageWidget.jsx",
]

messagesFiles.forEach((file) => {
  copyFile(
    `src/components/messages/${file}`,
    `src/features/messages/components/${file}`,
  )
})

// Messages conversation-detail
const conversationDetailFiles = [
  "ConversationDetail.jsx",
  "MessageBubble.jsx",
  "MessageInput.jsx",
  "MessageList.jsx",
]

conversationDetailFiles.forEach((file) => {
  copyFile(
    `src/components/messages/conversation-detail/${file}`,
    `src/features/messages/components/conversation-detail/${file}`,
  )
})

// Messages conversation-list
const conversationListFiles = ["ConversationItem.jsx", "ConversationList.jsx"]

conversationListFiles.forEach((file) => {
  copyFile(
    `src/components/messages/conversation-list/${file}`,
    `src/features/messages/components/conversation-list/${file}`,
  )
})

// Messages headers
const headerFiles = [
  "ConversationDetailHeader.jsx",
  "ConversationListHeader.jsx",
]

headerFiles.forEach((file) => {
  copyFile(
    `src/components/messages/headers/${file}`,
    `src/features/messages/components/headers/${file}`,
  )
})

// Messages hook
copyFile(
  "src/hooks/useConversationSignalR.js",
  "src/features/messages/hooks/useConversationSignalR.js",
)

console.log("\n✅ All files copied successfully!")
