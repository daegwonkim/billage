import { useState } from 'react'
import { Send } from 'lucide-react'

export function ChatInput() {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    // TODO: 메시지 전송 로직 구현
    console.log('Send message:', message)
    setMessage('')
  }

  return (
    <div className="sticky bottom-0 border-t border-gray-200 bg-white px-4 py-3">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="메시지를 입력하세요"
          className="flex-1 rounded-full border border-gray-300 bg-gray-50 px-4 py-2.5 text-[15px] outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400 focus:bg-white"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className={`flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border-none transition-colors ${
            message.trim()
              ? 'bg-black text-white'
              : 'bg-gray-200 text-gray-400'
          }`}>
          <Send size={18} />
        </button>
      </form>
    </div>
  )
}
