import type { RentalItem } from '@/api/rentall_item/dto/GetRentalItems'
import { formatCompactPrice, getTimeAgo } from '@/utils/utils'
import { MapPin, Package, Heart, Eye } from 'lucide-react'

interface RentalItemCardProps {
  rentalItem: RentalItem
  onClick?: () => void
}

export function RentalItemCard({ rentalItem, onClick }: RentalItemCardProps) {
  return (
    <div
      key={rentalItem.id}
      onClick={onClick}
      className="cursor-pointer border-b border-gray-100 bg-white p-4 transition-colors hover:bg-gray-50">
      <div className="flex gap-3">
        <div className="h-35 w-35 shrink-0">
          <img
            src={rentalItem.thumbnailImageUrl}
            alt={rentalItem.title}
            className="h-full w-full rounded object-cover"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between py-3">
          <div>
            <div className="flex justify-between gap-3">
              <h3
                className="mb-1.5 overflow-hidden text-[15px] leading-tight text-ellipsis text-gray-800"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                {rentalItem.title}
              </h3>
              <div>
                <Heart
                  size={22}
                  strokeWidth={1}
                  color="gray"
                />
              </div>
            </div>
            <div className="mb-2 flex items-center gap-1.5 text-xs text-gray-500">
              <MapPin
                size={14}
                strokeWidth={2}
                color="red"
              />
              <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                {rentalItem.address}
              </span>
              {rentalItem.createdAt && (
                <>
                  <span>·</span>
                  <span>{getTimeAgo(new Date(rentalItem.createdAt))}</span>
                </>
              )}
            </div>
          </div>

          <div>
            <div className="mb-1 flex items-baseline gap-0.5">
              <span className="text-sm font-extrabold text-gray-900">
                {formatCompactPrice(rentalItem.pricePerDay)}
              </span>
              <span className="text-xs text-gray-500">원 / 일</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-extrabold text-gray-900">
                  {formatCompactPrice(rentalItem.pricePerWeek)}
                </span>
                <span className="text-xs text-gray-500">원 / 주</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-gray-400">
                {rentalItem.rentalCount > 0 && (
                  <span className="flex items-center gap-0.5">
                    <Package size={14} />
                    {rentalItem.rentalCount}
                  </span>
                )}
                {rentalItem.likeCount > 0 && (
                  <span className="flex items-center gap-0.5">
                    <Heart size={14} />
                    {rentalItem.likeCount}
                  </span>
                )}
                {rentalItem.viewCount > 0 && (
                  <span className="flex items-center gap-0.5">
                    <Eye size={14} />
                    {rentalItem.viewCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
