import { RentalItems } from '@/components/main/RentalItems'
import { Header } from '../components/common/Header'
import { RentalItemCategories } from '../components/main/RentalItemCategories'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { useGetRentalItems } from '@/hooks/RentalItem'

export function Home() {
  const navigate = useNavigate()
  const observerTarget = useRef<HTMLDivElement>(null)

  const onRentalItemClick = (rentalItemId: string) => {
    navigate(`/rental-items/${rentalItemId}`)
  }

  const {
    data: rentalItemsData,
    isLoading: rentalItemsLoading,
    error: rentalItemsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useGetRentalItems()

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

  if (!rentalItemsData) {
    return
  }

  const allRentalItems = rentalItemsData.pages.flatMap(page => page.content)

  return (
    <div className="min-h-screen w-md">
      <Header />
      <RentalItemCategories />
      <div className="bg-white px-4 pt-2 text-xl font-bold">
        서울특별시 영등포구 당산동6가
      </div>
      <RentalItems
        rentalItems={allRentalItems}
        onRentalItemClick={onRentalItemClick}
        isFetchingNextPage={isFetchingNextPage}
      />
      {/* 무한 스크롤 트리거 요소 */}
      <div
        ref={observerTarget}
        className="h-5"
      />
    </div>
  )
}
