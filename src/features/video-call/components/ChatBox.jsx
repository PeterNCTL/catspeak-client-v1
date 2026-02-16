import React, { useState, useRef, useEffect } from "react"
import SendIcon from "@mui/icons-material/Send"
import { Typography, Box, IconButton, InputBase, Paper } from "@mui/material"
import { useLanguage } from "@/shared/context/LanguageContext"
import { colors } from "@/shared/utils/colors"
import { formatTime } from "@/shared/utils/dateFormatter"

const ChatBox = ({
  messages,
  currentUser,
  allParticipants,
  onSendMessage,
  isConnected,
  className = "",
}) => {
  const [message, setMessage] = useState("")
  const scrollRef = useRef(null)
  const { t } = useLanguage()

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message)
      setMessage("")
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend()
    }
  }

  return (
    <div className={`flex h-full flex-col bg-white ${className}`}>
      <div className="border-b border-gray-200 px-4 py-3">
        <Typography
          variant="subtitle2"
          className="text-headingColor"
          fontWeight="bold"
        >
          {t.rooms.chatBox.title}
        </Typography>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {messages.length === 0 ? (
          <Typography
            variant="body2"
            className="text-center text-gray-400 mt-10"
          >
            {t.rooms.chatBox.empty}
          </Typography>
        ) : (
          messages.map((msg) => {
            if (msg.type === "system") {
              return (
                <Typography
                  key={msg.id}
                  variant="caption"
                  display="block"
                  className="text-center text-gray-400 italic my-2"
                >
                  {msg.content}
                </Typography>
              )
            }

            const sender = allParticipants.find(
              (p) =>
                String(p.accountId) === String(msg.senderId) ||
                String(p.id) === String(msg.senderId),
            )

            const isMe =
              String(msg.senderId) === String(currentUser?.accountId) ||
              String(msg.senderId) === String(currentUser?.id) ||
              (sender &&
                String(sender.accountId) === String(currentUser?.accountId))
            const senderName = isMe
              ? t.rooms.chatBox.you
              : sender?.username || sender?.name || `User ${msg.senderId}`

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  isMe ? "items-end" : "items-start"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Typography
                    variant="caption"
                    fontWeight="bold"
                    color="text.secondary"
                  >
                    {senderName}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.disabled"
                    sx={{ fontSize: "0.65rem" }}
                  >
                    {formatTime(msg.timestamp)}
                  </Typography>
                </div>
                <div
                  className={`px-3 py-2 rounded-full max-w-[85%] break-words shadow-sm ${
                    isMe
                      ? "text-white"
                      : "bg-gray-100 text-textColor border border-gray-100"
                  }`}
                  style={
                    isMe ? { backgroundColor: colors.red[700] } : undefined
                  }
                >
                  <Typography variant="body2">{msg.content}</Typography>
                </div>
              </div>
            )
          })
        )}
        {/* Auto-scroll anchor */}
        <div ref={scrollRef} />
      </div>

      <div className="border-t border-gray-200 p-4">
        <Paper
          component="div"
          className="flex items-center gap-2 p-1 border rounded-lg focus-within:ring-1 focus-within:ring-[var(--cath-primary)] focus-within:border-[var(--cath-primary)]"
          elevation={0}
          sx={{ borderColor: "divider" }}
        >
          <InputBase
            disabled={!isConnected}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              isConnected
                ? t.rooms.chatBox.inputPlaceholder
                : t.rooms.chatBox.connectingPlaceholder
            }
            className="flex-1 text-sm text-headingColor placeholder:text-gray-400"
            sx={{ ml: 1, flex: 1, fontSize: "0.875rem" }}
          />
          <IconButton
            onClick={handleSend}
            disabled={!isConnected || !message.trim()}
            size="small"
            sx={{
              bgcolor: colors.red[700],
              color: "white",
              "&:hover": {
                bgcolor: colors.red[800],
              },
              "&.Mui-disabled": {
                bgcolor: "rgba(0, 0, 0, 0.12)",
                color: "rgba(0, 0, 0, 0.26)",
              },
              width: 32,
              height: 32,
              borderRadius: 2,
            }}
          >
            <SendIcon fontSize="small" />
          </IconButton>
        </Paper>
      </div>
    </div>
  )
}

export default ChatBox
