import { SlidersHorizontal, ArrowUpDown, MapPin } from 'lucide-react'
import type { ReactNode } from 'react'

interface FilterSortBarProps {
  onFilterClick: () => void
  onSortClick: () => void
  neighborhood?: ReactNode
}

export function FilterSortBar({
  onFilterClick,
  onSortClick,
  neighborhood
}: FilterSortBarProps) {
  return (
    <div className="sticky top-13 z-40 border-b border-gray-100 bg-white px-4 py-3">
      <div className="flex items-center justify-between">
        {/* 주소 */}
        <div className="flex items-center gap-1.5">
          <MapPin
            size={18}
            className="text-neutral-600"
          />
          <span className="text-[15px] font-semibold text-neutral-900">
            {neighborhood}
          </span>
        </div>

        {/* 필터 및 정렬 버튼 */}
        <div className="flex items-center gap-2">
          {/* 필터 버튼 */}
          <button
            onClick={onFilterClick}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-gray-50">
            <SlidersHorizontal size={16} />
            <span>필터</span>
          </button>

          {/* 정렬 버튼 */}
          <button
            onClick={onSortClick}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-gray-50">
            <ArrowUpDown size={16} />
            <span>정렬</span>
          </button>
        </div>
      </div>
    </div>
  )
}
