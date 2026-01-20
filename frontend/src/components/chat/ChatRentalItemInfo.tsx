import { useEffect, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { generateSignedUrl } from '@/api/storage/storage'
import { formatCompactPrice } from '@/utils/utils'

interface ChatRentalItemInfoProps {
  rentalItem: {
    id: number
    title: string
    pricePerDay: number
    imageUrl: string
  }
  onClick: () => void
}

export function ChatRentalItemInfo({
  rentalItem,
  onClick
}: ChatRentalItemInfoProps) {
  const [imageUrl, setImageUrl] = useState<string>('')

  useEffect(() => {
    const fetchImage = async () => {
      if (rentalItem.imageUrl) {
        try {
          const { signedUrl } = await generateSignedUrl({
            bucket: 'rental-item-images',
            fileKey: rentalItem.imageUrl
          })
          setImageUrl(signedUrl)
        } catch (error) {
          console.error('Failed to fetch rental item image URL:', error)
        }
      }
    }

    fetchImage()
  }, [rentalItem.imageUrl])

  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer items-center gap-3 border-b border-gray-200 bg-gray-50 px-4 py-3 transition-colors hover:bg-gray-100">
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-200">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={rentalItem.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
            이미지
          </div>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="truncate text-sm font-medium text-gray-900">
          {rentalItem.title}
        </div>
        <div className="mt-0.5 text-sm font-bold text-gray-700">
          {formatCompactPrice(rentalItem.pricePerDay)}
          <span className="font-normal text-gray-500"> 원 / 일</span>
        </div>
      </div>

      <ChevronRight size={20} className="shrink-0 text-gray-400" />
    </div>
  )
}
