import { ChevronLeft } from 'lucide-react'
import defaultProfileImage from '@/assets/default-profile.png'
import type { Participant } from '@/api/chat/dto/GetChatRoom'

interface ChatHeaderProps {
  participants: Participant[]
  onBack: () => void
}

export function ChatHeader({ participants, onBack }: ChatHeaderProps) {
  return (
    <header className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
      <button
        onClick={onBack}
        className="cursor-pointer border-none bg-transparent p-0 text-gray-600 transition-colors hover:text-black">
        <ChevronLeft
          size={28}
          strokeWidth={1.5}
        />
      </button>

      <div className="flex flex-1 items-center gap-3">
        {participants.length === 1 ? (
          <img
            src={participants[0].profileImageUrl || defaultProfileImage}
            alt={participants[0].nickname}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="relative h-10 w-10 shrink-0">
            <img
              src={participants[0]?.profileImageUrl || defaultProfileImage}
              alt={participants[0]?.nickname}
              className="absolute top-0 left-0 h-7 w-7 rounded-full border-2 border-white object-cover"
            />
            <img
              src={participants[1]?.profileImageUrl || defaultProfileImage}
              alt={participants[1]?.nickname}
              className="absolute right-0 bottom-0 h-7 w-7 rounded-full border-2 border-white object-cover"
            />
          </div>
        )}
        <div>
          <div className="text-base font-bold text-gray-900">
            {participants.map(p => p.nickname).join(', ')}
          </div>
        </div>
      </div>
    </header>
  )
}
