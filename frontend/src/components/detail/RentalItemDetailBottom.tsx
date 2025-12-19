import { formatCompactPrice } from '@/utils/utils'
import { Heart } from 'lucide-react'

interface RentalItemDetailBottomProps {
  liked: boolean
  pricePerDay: number
  pricePerWeek: number
}

export function RentalItemDetailBottom({
  liked,
  pricePerDay,
  pricePerWeek
}: RentalItemDetailBottomProps) {
  return (
    <div className="fixed bottom-0 left-1/2 flex w-full max-w-md -translate-x-1/2 items-center gap-5 border-t border-gray-200 bg-white p-4">
      <Heart
        size={40}
        color={liked ? '#ff4d4f' : '#888'}
        fill={liked ? '#ff4d4f' : 'none'}
        className="shrink-0 cursor-pointer"
      />
      <div className="flex-1 text-lg font-extrabold">
        <div>
          {formatCompactPrice(pricePerDay)}
          <span className="text-sm text-gray-600">원 / 일</span>
        </div>
        <div>
          {formatCompactPrice(pricePerWeek)}
          <span className="text-sm text-gray-600">원 / 주</span>
        </div>
      </div>
      <button className="cursor-pointer rounded-lg bg-black px-8 py-4 text-base font-bold text-white">
        채팅하기
      </button>
    </div>
  )
}
