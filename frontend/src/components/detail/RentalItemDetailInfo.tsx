import type { GetRentalItemResponse } from '@/api/rentall_item/dto/GetRentalItem'
import { getCategoryLabel } from '@/utils/category'
import { getTimeAgo } from '@/utils/utils'
import { MapPin } from 'lucide-react'
import { useState } from 'react'

interface RentalItemDetailInfoProps {
  rentalItem: GetRentalItemResponse
}

const MAX_DESCRIPTION_LENGTH = 200

export function RentalItemDetailInfo({
  rentalItem
}: RentalItemDetailInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const infoItems = [
    rentalItem.rentalCount > 0 ? `대여 ${rentalItem.rentalCount}` : null,
    rentalItem.likeCount > 0 ? `관심 ${rentalItem.likeCount}` : null,
    rentalItem.viewCount > 0 ? `조회 ${rentalItem.viewCount}` : null
  ].filter(Boolean)

  const isLongDescription =
    rentalItem.description.length > MAX_DESCRIPTION_LENGTH
  const displayedDescription =
    isExpanded || !isLongDescription
      ? rentalItem.description
      : rentalItem.description.slice(0, MAX_DESCRIPTION_LENGTH) + '...'

  return (
    <div className="px-4 py-4">
      <h2 className="mt-0 mb-3 text-2xl font-extrabold">{rentalItem.title}</h2>

      <div className="pr-1.5 pl-1.5">
        <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-gray-500">
          <div className="flex gap-2">
            <span className="underline underline-offset-[1.5px]">
              {getCategoryLabel(rentalItem.category)}
            </span>
            <div className="flex items-center gap-0.5">
              <MapPin
                size={18}
                color="red"
              />
              <span>{rentalItem.seller.address}</span>
            </div>
          </div>
          <span className="ml-auto">
            {rentalItem.createdAt && (
              <span>{getTimeAgo(new Date(rentalItem.createdAt))}</span>
            )}
          </span>
        </div>

        <div className="mb-6">
          <h2 className="mb-3 text-lg font-bold">상세 설명</h2>
          <p className="text-[15px] leading-relaxed whitespace-pre-line text-gray-800">
            {displayedDescription}
          </p>
          {isLongDescription && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-xs text-gray-500 underline underline-offset-2">
              {isExpanded ? '간략히' : '더보기'}
            </button>
          )}
        </div>
        <div className="flex gap-1 text-[13px] text-gray-500">
          {infoItems.map((item, index) => (
            <span
              key={index}
              className="flex items-center gap-1">
              {item}
              {index < infoItems.length - 1 && <span>·</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
