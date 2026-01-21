import { formatCompactPrice } from '@/utils/utils'
import { Heart } from 'lucide-react'

interface RentalItemDetailBottomProps {
  liked: boolean
  pricePerDay: number
  pricePerWeek: number
  onLikeClick: () => void
  isAnimating: boolean
  onChatClick: () => void
  isOwner?: boolean
}

export function RentalItemDetailBottom({
  liked,
  pricePerDay,
  pricePerWeek,
  onLikeClick,
  isAnimating,
  onChatClick,
  isOwner = false
}: RentalItemDetailBottomProps) {
  return (
    <div className="fixed bottom-0 left-1/2 flex w-full max-w-md -translate-x-1/2 items-center gap-5 border-t border-gray-200 bg-white p-4">
      <Heart
        size={40}
        strokeWidth={1}
        color={isOwner ? '#d1d5db' : liked ? 'red' : 'gray'}
        fill={isOwner ? 'none' : liked ? 'red' : 'none'}
        className={`shrink-0 transition-transform duration-300 ${
          isOwner
            ? 'cursor-not-allowed opacity-50'
            : `cursor-pointer active:scale-90 ${isAnimating ? 'scale-125' : 'scale-100'}`
        }`}
        onClick={isOwner ? undefined : onLikeClick}
      />
      <div className="flex-1 text-lg font-extrabold">
        <div>
          {pricePerDay > 0 ? (
            <>
              {formatCompactPrice(pricePerDay)}
              <span className="text-sm text-gray-600"> 원 / 일</span>
            </>
          ) : (
            <>
              <span className="text-gray-400">-</span>
              <span className="text-sm text-gray-400"> 원 / 일</span>
            </>
          )}
        </div>
        <div>
          {pricePerWeek > 0 ? (
            <>
              {formatCompactPrice(pricePerWeek)}
              <span className="text-sm text-gray-600"> 원 / 주</span>
            </>
          ) : (
            <>
              <span className="text-gray-400">-</span>
              <span className="text-sm text-gray-400"> 원 / 주</span>
            </>
          )}
        </div>
      </div>
      <button
        onClick={isOwner ? undefined : onChatClick}
        disabled={isOwner}
        className={`rounded-lg px-8 py-4 text-base font-bold ${
          isOwner
            ? 'cursor-not-allowed bg-gray-300 text-gray-500'
            : 'cursor-pointer bg-black text-white'
        }`}>
        채팅하기
      </button>
    </div>
  )
}
