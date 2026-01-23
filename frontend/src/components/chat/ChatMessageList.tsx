import { useEffect, useRef } from 'react'
import { formatDateLabel, formatTime } from '@/utils/utils'

interface Message {
  id: string | number
  senderId: number
  content: string
  createdAt: Date
}

interface ChatMessageListProps {
  messages: Message[]
  currentUserId: number
}

export function ChatMessageList({
  messages,
  currentUserId
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
          const prevMessage = messages[index - 1]
          const showDateDivider =
            index === 0 ||
            message.createdAt.toDateString() !==
              prevMessage.createdAt.toDateString()

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
                <div
                  className={`flex max-w-[75%] flex-col ${isMyMessage ? 'items-end' : 'items-start'}`}>
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
                  <span className="mt-1 text-xs text-gray-400">
                    {formatTime(message.createdAt)}
                  </span>
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
