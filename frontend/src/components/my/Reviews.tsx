import { ChevronRight, Frown, Star } from 'lucide-react'

import defaultProfileImage from '@/assets/default-profile.png'

export function Reviews() {
  const reviews = [
    {
      id: 1,
      reviewer: '마챠랏떼',
      profileImageUrl: defaultProfileImage,
      neighborhood: '영등포구 당산동6가',
      content: '물건 상태가 좋고 친절하셨어요!',
      rating: 5,
      date: '2일 전',
      images: [
        'https://placehold.co/80x80',
        'https://placehold.co/80x80',
        'https://placehold.co/80x80'
      ]
    },
    {
      id: 2,
      reviewer: '망고스틴',
      profileImageUrl: defaultProfileImage,
      neighborhood: '영등포구 당산동',
      content: '시간 약속을 잘 지키시네요',
      rating: 4,
      date: '7일 전',
      images: []
    },
    {
      id: 3,
      reviewer: '망고스틴',
      profileImageUrl: defaultProfileImage,
      neighborhood: '영등포구 당산동',
      content: '시간 약속을 잘 지키시네요',
      rating: 4,
      date: '7일 전',
      images: []
    },
    {
      id: 4,
      reviewer: '망고스틴',
      profileImageUrl: defaultProfileImage,
      neighborhood: '영등포구 당산동',
      content: '시간 약속을 잘 지키시네요',
      rating: 4,
      date: '7일 전',
      images: []
    }
  ]

  const isLoading = false
  const isError = false

  if (isLoading) {
    return (
      <div className="border-t border-gray-100 py-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-4 pb-3">
          <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="px-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex gap-3 border-b border-gray-100 py-3 last:border-b-0">
              {/* 프로필 이미지 */}
              <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-gray-200" />

              {/* 내용 */}
              <div className="flex-1">
                {/* 이름 / 동네 / 날짜 */}
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                    <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
                  </div>
                  <div className="h-3 w-10 animate-pulse rounded bg-gray-200" />
                </div>

                {/* 별점 */}
                <div className="mb-2 flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-3 w-3 animate-pulse rounded bg-gray-200"
                    />
                  ))}
                </div>

                {/* 후기 텍스트 */}
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />

                {/* 이미지 */}
                <div className="mt-2 flex gap-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-16 w-16 animate-pulse rounded-lg bg-gray-200"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-[300px] flex-col items-center justify-center gap-2 border-t border-gray-100 text-gray-400">
        <Frown size={32} />
        <div className="text-sm">앗! 데이터를 조회하는데 실패했어요</div>
      </div>
    )
  }

  return (
    <>
      {/* 받은 후기 섹션 - 리스트 */}
      <div className="border-t border-gray-100 py-4">
        <div className="flex items-center justify-between px-4 pb-3">
          <h3 className="text-base font-bold text-neutral-900">받은 후기 9</h3>
          <button className="group flex items-center text-sm text-neutral-500">
            전체보기
            <ChevronRight
              size={16}
              className="icon-arrow-move"
            />
          </button>
        </div>
        <div className="px-4">
          {reviews.slice(0, 3).map(review => (
            <div
              key={review.id}
              className="flex gap-3 border-b border-gray-100 py-3 last:border-b-0">
              {/* 프로필 이미지 */}
              <img
                src={review.profileImageUrl}
                alt={review.reviewer}
                className="h-10 w-10 shrink-0 rounded-full object-cover"
              />
              {/* 후기 내용 */}
              <div className="flex-1">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-neutral-800">
                      {review.reviewer}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {review.neighborhood}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-400">
                    {review.date}
                  </span>
                </div>
                <div className="mb-2 flex items-center gap-0.5">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className="fill-indigo-300 text-indigo-300"
                    />
                  ))}
                </div>
                <p className="text-sm text-neutral-600">{review.content}</p>
                {/* 리뷰 이미지 */}
                {review.images.length > 0 && (
                  <div className="mt-2 flex gap-2">
                    {review.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`리뷰 이미지 ${index + 1}`}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
