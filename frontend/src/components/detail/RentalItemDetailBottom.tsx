import { formatCompactPrice } from '@/utils/utils'
import { Heart } from 'lucide-react'

interface RentalItemDetailBottomProps {
  liked: boolean
  pricePerDay: number
  pricePerWeek: number
  onLikeClick: () => void
  isAnimating: boolean
}

export function RentalItemDetailBottom({
  liked,
  pricePerDay,
  pricePerWeek,
  onLikeClick,
  isAnimating
}: RentalItemDetailBottomProps) {
  return (
    <div className="fixed bottom-0 left-1/2 flex w-full max-w-md -translate-x-1/2 items-center gap-5 border-t border-gray-200 bg-white p-4">
      <Heart
        size={40}
        strokeWidth={1}
        color={liked ? 'red' : 'gray'}
        fill={liked ? 'red' : 'none'}
        className={`shrink-0 cursor-pointer transition-transform duration-300 active:scale-90 ${isAnimating ? 'scale-125' : 'scale-100'}`}
        onClick={onLikeClick}
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
      <button className="cursor-pointer rounded-lg bg-black px-8 py-4 text-base font-bold text-white">
        채팅하기
      </button>
    </div>
  )
}
