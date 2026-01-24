import { ChevronLeft, Heart, RotateCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { RentalItemCard } from '@/components/main/RentalItemCard'
import { useQuery } from '@tanstack/react-query'
import { getUserLikedRentalItems } from '@/api/user/user'
import type { RentalItem } from '@/api/rentall_item/dto/GetRentalItems'

export function LikesList() {
  const navigate = useNavigate()

  const {
    data,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['likedRentalItems'],
    queryFn: getUserLikedRentalItems
  })

  const likedItems: RentalItem[] =
    data?.rentalItems.map(item => ({
      id: item.id,
      title: item.title,
      thumbnailImageUrl: item.thumbnailImageUrl ?? '',
      address: item.address,
      pricePerDay: item.pricePerDay ?? 0,
      pricePerWeek: item.pricePerWeek ?? 0,
      liked: item.liked,
      createdAt: item.createdAt,
      sellerId: 0,
      stats: item.stats
    })) ?? []

  return (
    <div className="min-h-screen w-md bg-white">
      {/* 상단 바 */}
      <div className="sticky top-0 z-10 flex h-14 items-center border-b border-gray-100 bg-white px-4">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-2 rounded-lg p-2 transition-colors hover:bg-gray-50">
          <ChevronLeft
            size={24}
            className="text-neutral-700"
          />
        </button>
        <div className="flex-1 text-center text-base font-extrabold text-neutral-900">
          좋아요 목록
        </div>
      </div>

      {/* 로딩 스켈레톤 */}
      {isLoading ? (
        <div className="divide-y divide-gray-100">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex gap-3 p-4">
              <div className="h-35 w-35 shrink-0 animate-pulse rounded-lg bg-gray-200" />
              <div className="flex flex-1 flex-col justify-between py-3">
                <div>
                  <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100" />
                </div>
                <div>
                  <div className="mb-1 h-4 w-20 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center px-4 py-20">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <RotateCw
              size={24}
              className="text-gray-400"
            />
          </div>
          <p className="mb-1 text-base font-semibold text-neutral-800">
            목록을 불러올 수 없습니다
          </p>
          <p className="mb-5 text-sm text-neutral-400">
            네트워크 연결을 확인하고 다시 시도해주세요
          </p>
          <button
            onClick={() => refetch()}
            className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800">
            다시 시도
          </button>
        </div>
      ) : likedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-4 py-20">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <Heart
              size={24}
              className="text-gray-400"
            />
          </div>
          <p className="mb-1 text-base font-semibold text-neutral-800">
            좋아요한 물품이 없어요
          </p>
          <p className="text-sm text-neutral-400">
            관심있는 물품에 좋아요를 눌러보세요
          </p>
        </div>
      ) : (
        <div className="pb-20">
          {likedItems.map(item => (
            <RentalItemCard
              key={item.id}
              rentalItem={item}
              onClick={() => navigate(`/rental-items/${item.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
