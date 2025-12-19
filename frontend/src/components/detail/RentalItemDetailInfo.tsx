import type { GetRentalItemResponse } from '@/api/rentall_item/dto/GetRentalItem'
import { getTimeAgo } from '@/utils/utils'

interface RentalItemDetailInfoProps {
  rentalItem: GetRentalItemResponse
}

export function RentalItemDetailInfo({
  rentalItem
}: RentalItemDetailInfoProps) {
  const infoItems = [
    rentalItem.rentalCount > 0 ? `대여 ${rentalItem.rentalCount}` : null,
    rentalItem.likeCount > 0 ? `관심 ${rentalItem.likeCount}` : null,
    rentalItem.viewCount > 0 ? `조회 ${rentalItem.viewCount}` : null
  ].filter(Boolean)

  return (
    <div className="px-4 py-4">
      <h1 className="mt-0 mb-3 text-[22px] font-bold">{rentalItem.title}</h1>

      <div className="mb-5 flex items-center gap-2 text-sm text-gray-600">
        {rentalItem.category && (
          <span className="text-[15px] underline underline-offset-[1.5px]">
            {rentalItem.category}
          </span>
        )}
        <span className="ml-auto">
          {rentalItem.createdAt && (
            <span>{getTimeAgo(new Date(rentalItem.createdAt))}</span>
          )}
        </span>
      </div>

      <div className="mb-6">
        <h2 className="mb-3 text-base font-bold">상세 설명</h2>
        <p className="text-[15px] leading-relaxed whitespace-pre-line text-gray-800">
          {rentalItem.description}
        </p>
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
  )
}
