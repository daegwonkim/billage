import { useEffect, useRef } from 'react'
import { formatDateLabel, formatTime } from '@/utils/utils'
import defaultProfileImage from '@/assets/default-profile.png'
import type { Participant } from '@/api/chat/dto/GetChatRoom'

interface Message {
  id: string | number
  senderId: number
  content: string
  createdAt: Date
}

interface ChatMessageListProps {
  messages: Message[]
  currentUserId: number
  participants: Participant[]
}

export function ChatMessageList({
  messages,
  currentUserId,
  participants
}: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const isInitialLoad = useRef(true)

  useEffect(() => {
    if (messages.length === 0) return

    if (isInitialLoad.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'instant' })
      isInitialLoad.current = false
    } else {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      <div className="flex flex-col gap-3">
        {messages.map((message, index) => {
          const isMyMessage = message.senderId === currentUserId
          const sender = !isMyMessage
            ? participants.find(p => p.id === message.senderId)
            : undefined
          const prevMessage = messages[index - 1]
          const showDateDivider =
            index === 0 ||
            message.createdAt.toDateString() !==
              prevMessage.createdAt.toDateString()
          const showSenderInfo =
            !isMyMessage &&
            sender &&
            (index === 0 || prevMessage.senderId !== message.senderId)

          return (
            <div key={message.id}>
              {showDateDivider && (
                <div className="my-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-gray-200" />
                  <span className="text-xs text-gray-400">
                    {formatDateLabel(message.createdAt)}
                  </span>
                  <div className="h-px flex-1 bg-gray-200" />
                </div>
              )}
              <div
                className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                {!isMyMessage && sender && (
                  <img
                    src={
                      showSenderInfo
                        ? sender.profileImageUrl || defaultProfileImage
                        : undefined
                    }
                    alt={sender.nickname}
                    className={`mr-2 h-8 w-8 shrink-0 self-start rounded-full object-cover ${!showSenderInfo ? 'invisible' : ''}`}
                  />
                )}
                <div
                  className={`flex max-w-[65%] flex-col ${isMyMessage ? 'items-end' : 'items-start'}`}>
                  {showSenderInfo && (
                    <span className="mb-1 text-xs font-medium text-gray-600">
                      {sender.nickname}
                    </span>
                  )}
                  <div
                    className={`flex items-end gap-1.5 ${isMyMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div
                      className={`rounded-2xl px-4 py-2.5 ${
                        isMyMessage
                          ? 'rounded-br-sm bg-black text-white'
                          : 'rounded-bl-sm bg-gray-100 text-gray-900'
                      }`}>
                      <p className="wrap-break-words text-[15px] leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                    <span className="shrink-0 text-[11px] text-gray-400">
                      {formatTime(message.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
