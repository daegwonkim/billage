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
  const formatTime = (date: Date) => {
    const hours = date.getHours()
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const period = hours < 12 ? '오전' : '오후'
    const displayHours = hours % 12 || 12
    return `${period} ${displayHours}:${minutes}`
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      <div className="flex flex-col gap-3">
        {messages.map(message => {
          const isMyMessage = message.senderId === currentUserId

          return (
            <div
              key={message.id}
              className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`flex max-w-[75%] flex-col ${isMyMessage ? 'items-end' : 'items-start'}`}>
                <div
                  className={`rounded-2xl px-4 py-2.5 ${
                    isMyMessage
                      ? 'rounded-br-sm bg-black text-white'
                      : 'rounded-bl-sm bg-gray-100 text-gray-900'
                  }`}>
                  <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">
                    {message.content}
                  </p>
                </div>
                <span className="mt-1 text-xs text-gray-400">
                  {formatTime(message.createdAt)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
