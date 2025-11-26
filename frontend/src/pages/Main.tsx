import { RentalItems } from '@/components/main/RentalItems'
import { Header } from '../components/common/Header'
import { RentalItemCategories } from '../components/main/RentalItemCategories'
import { useNavigate } from 'react-router-dom'
import { useRentalItemCategories } from '@/hooks/useRentalItemCategories'
import { useRentalItems } from '@/hooks/useRentalItems'
import { useEffect, useRef } from 'react'

export function Main() {
  const navigate = useNavigate()
  const observerTarget = useRef<HTMLDivElement>(null)

  const onRentalItemClick = (rentalItemId: string) => {
    navigate(`/api/rental-items/${rentalItemId}`)
  }

  const {
    data: rentalItemCategoriesData,
    isLoading: rentalItemCategoriesLoading,
    error: rentalItemCategoriesError
  } = useRentalItemCategories()

  const {
    data: rentalItemsData,
    isLoading: rentalItemsLoading,
    error: rentalItemsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useRentalItems()

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

  const isLoading = rentalItemCategoriesLoading || rentalItemsLoading
  const error = rentalItemCategoriesError || rentalItemsError

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error || !rentalItemCategoriesData || !rentalItemsData) {
    return <div>Error: {error?.message}</div>
  }

  const allRentalItems = rentalItemsData.pages.flatMap(page => page.content)

  return (
    <>
      <Header />
      <RentalItemCategories
        rentalItemCategories={rentalItemCategoriesData.rentalItemCategories}
      />
      <RentalItems
        rentalItems={allRentalItems}
        onRentalItemClick={onRentalItemClick}
      />

      {/* 무한 스크롤 트리거 요소 */}
      <div
        ref={observerTarget}
        style={{ height: '20px' }}
      />

      {isFetchingNextPage && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Loading more...
        </div>
      )}
    </>
  )
}
