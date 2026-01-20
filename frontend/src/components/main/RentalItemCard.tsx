import type { RentalItem } from '@/api/rentall_item/dto/GetRentalItems'
import { formatCompactPrice, getTimeAgo } from '@/utils/utils'
import { MapPin, Package, Heart, Eye } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { LoginPrompt } from '../auth/LoginPrompt'
import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { like, unlike } from '@/api/rentall_item/rentalItem'
import toast from 'react-hot-toast'

interface RentalItemCardProps {
  rentalItem: RentalItem
  onClick?: () => void
}

export function RentalItemCard({ rentalItem, onClick }: RentalItemCardProps) {
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [liked, setLiked] = useState(rentalItem.liked ?? false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setLiked(rentalItem.liked ?? false)
  }, [rentalItem.liked])

  const likeMutation = useMutation({
    mutationFn: () => like(rentalItem.id),
    onSuccess: () => {
      setLiked(true)
      queryClient.invalidateQueries({ queryKey: ['rentalItems'] })
    },
    onError: () => {
      toast.error('좋아요 등록에 실패했어요')
    }
  })

  const unlikeMutation = useMutation({
    mutationFn: () => unlike(rentalItem.id),
    onSuccess: () => {
      setLiked(false)
      queryClient.invalidateQueries({ queryKey: ['rentalItems'] })
    },
    onError: () => {
      toast.error('좋아요 해제에 실패했어요')
    }
  })

  const isLikePending = likeMutation.isPending || unlikeMutation.isPending

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }

    if (isLikePending) return

    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300)

    if (liked) {
      unlikeMutation.mutate()
    } else {
      likeMutation.mutate()
    }
  }

  return (
    <>
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
                <button
                  type="button"
                  onClick={handleLikeClick}
                  className="transition-transform duration-300 active:scale-90">
                  <Heart
                    size={22}
                    strokeWidth={1}
                    fill={liked ? 'red' : 'none'}
                    color={liked ? 'red' : 'gray'}
                    className={`transition-transform duration-300 ${isAnimating ? 'scale-125' : 'scale-100'}`}
                  />
                </button>
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
                {rentalItem.pricePerDay > 0 ? (
                  <>
                    <span className="text-sm font-extrabold text-gray-900">
                      {formatCompactPrice(rentalItem.pricePerDay)}
                    </span>
                    <span className="text-xs text-gray-500">원 / 일</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm font-extrabold text-gray-400">
                      -
                    </span>
                    <span className="text-xs text-gray-400">원 / 일</span>
                  </>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-1">
                  {rentalItem.pricePerWeek > 0 ? (
                    <>
                      <span className="text-sm font-extrabold text-gray-900">
                        {formatCompactPrice(rentalItem.pricePerWeek)}
                      </span>
                      <span className="text-xs text-gray-500">원 / 주</span>
                    </>
                  ) : (
                    <>
                      <span className="text-sm font-extrabold text-gray-400">
                        -
                      </span>
                      <span className="text-xs text-gray-400">원 / 주</span>
                    </>
                  )}
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

      {showLoginModal && (
        <LoginPrompt
          isModal
          onClose={() => setShowLoginModal(false)}
        />
      )}
    </>
  )
}
