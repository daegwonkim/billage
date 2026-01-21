import { ChevronLeft } from 'lucide-react'
import defaultProfileImage from '@/assets/default-profile.png'

interface ChatHeaderProps {
  seller: {
    id: number
    nickname: string
    profileImageUrl?: string
    address: string
  }
  onBack: () => void
}

export function ChatHeader({ seller, onBack }: ChatHeaderProps) {
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
        <img
          src={seller.profileImageUrl || defaultProfileImage}
          alt={seller.nickname}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div>
          <div className="flex items-end gap-1 text-base font-bold text-gray-900">
            {seller.nickname}
          </div>
          <div className="flex gap-1 text-xs text-gray-400">
            <div>{seller.address}</div>·<div>평균 10분 이내 응답</div>
          </div>
        </div>
      </div>
    </header>
  )
}
