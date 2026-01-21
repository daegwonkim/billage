import { ChevronRight } from 'lucide-react'
import { formatCompactPrice } from '@/utils/utils'
import { getCategoryLabel } from '@/utils/category'

interface ChatRentalItemInfoProps {
  rentalItem: {
    id: number
    title: string
    category: string
    pricePerDay?: number
    pricePerWeek?: number
    imageUrl: string
  }
  onClick: () => void
}

export function ChatRentalItemInfo({
  rentalItem,
  onClick
}: ChatRentalItemInfoProps) {
  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer items-center gap-3 border-b border-gray-200 bg-gray-50 px-4 py-3 transition-colors hover:bg-gray-100">
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-200">
        <img
          src={rentalItem.imageUrl}
          alt={rentalItem.title}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="flex items-center gap-1.5">
          <span className="shrink-0 rounded bg-gray-200 px-1.5 py-0.5 text-xs text-gray-600">
            {getCategoryLabel(rentalItem.category)}
          </span>
          <span className="truncate text-sm font-medium text-gray-900">
            {rentalItem.title}
          </span>
        </div>
        <div className="mt-0.5 text-xs font-bold text-gray-700">
          {rentalItem.pricePerDay ? (
            <>
              <span className="text-xs font-extrabold text-gray-900">
                {formatCompactPrice(rentalItem.pricePerDay)}
              </span>
              <span className="text-xs text-gray-500">원 / 일</span>
            </>
          ) : (
            <>
              <span className="text-xs font-extrabold text-gray-400">-</span>
              <span className="text-xs text-gray-400">원 / 일</span>
            </>
          )}
        </div>
        <div className="mt-0.5 text-xs font-bold text-gray-700">
          {rentalItem.pricePerWeek ? (
            <>
              <span className="text-xs font-extrabold text-gray-900">
                {formatCompactPrice(rentalItem.pricePerWeek)}
              </span>
              <span className="text-xs text-gray-500">원 / 주</span>
            </>
          ) : (
            <>
              <span className="text-xs font-extrabold text-gray-400">-</span>
              <span className="text-xs text-gray-400">원 / 주</span>
            </>
          )}
        </div>
      </div>

      <ChevronRight
        size={20}
        className="shrink-0 text-gray-400"
      />
    </div>
  )
}
