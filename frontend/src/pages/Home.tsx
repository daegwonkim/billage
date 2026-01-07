import { RentalItems } from '@/components/main/RentalItems'
import { Header } from '../components/common/Header'
import { RentalItemCategories } from '../components/main/RentalItemCategories'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useGetRentalItems } from '@/hooks/RentalItem'

export function Home() {
  const navigate = useNavigate()
  const observerTarget = useRef<HTMLDivElement>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  )

  const onRentalItemClick = (rentalItemId: string) => {
    navigate(`/rental-items/${rentalItemId}`)
  }

  const handleCategoryChange = (category: string) => {
    // 'ALL'이면 undefined로 설정 (필터 없음)
    setSelectedCategory(category === 'ALL' ? undefined : category)
  }

  const {
    data: rentalItemsData,
    isLoading: rentalItemsLoading,
    error: rentalItemsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useGetRentalItems(selectedCategory)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  const allRentalItems =
    rentalItemsData?.pages.flatMap(page => page.content) ?? []

  return (
    <div className="min-h-screen w-md bg-white">
      <Header />
      <RentalItemCategories
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
      <div className="px-4 pt-2 text-xl font-bold">
        서울특별시 영등포구 당산동6가
      </div>

      {rentalItemsError && (
        <div className="flex flex-col items-center justify-center px-4 py-20">
          <div className="text-center">
            <p className="mb-2 text-lg font-semibold text-neutral-800">
              데이터를 불러오지 못했습니다
            </p>
            <p className="text-sm text-neutral-500">
              네트워크 연결을 확인하고 다시 시도해주세요
            </p>
          </div>
        </div>
      )}

      {!rentalItemsError &&
        !rentalItemsLoading &&
        allRentalItems.length === 0 && (
          <div className="flex flex-col items-center justify-center px-4 py-20">
            <div className="text-center">
              <p className="mb-2 text-lg font-semibold text-neutral-800">
                등록된 대여 물품이 없습니다
              </p>
              <p className="text-sm text-neutral-500">
                첫 번째로 물품을 등록해보세요
              </p>
            </div>
          </div>
        )}

      {allRentalItems.length > 0 && (
        <RentalItems
          rentalItems={allRentalItems}
          onRentalItemClick={onRentalItemClick}
          isFetchingNextPage={isFetchingNextPage}
        />
      )}

      {/* 무한 스크롤 트리거 요소 */}
      <div
        ref={observerTarget}
        className="h-5"
      />
    </div>
  )
}
