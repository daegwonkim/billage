import { RentalItems } from '@/components/main/RentalItems'
import { Header } from '../components/common/Header'
import { RentalItemCategories } from '../components/main/RentalItemCategories'
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useGetRentalItems } from '@/hooks/RentalItem'
import { useLocateNeighborhood } from '@/hooks/Neighborhood'

export function Home() {
  const navigate = useNavigate()
  const observerTarget = useRef<HTMLDivElement>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  )
  const [location, setLocation] = useState<{
    latitude: string
    longitude: string
  } | null>(null)
  const [showLocationPermissionModal, setShowLocationPermissionModal] =
    useState(false)

  // 현재 위치 가져오기
  useEffect(() => {
    const requestLocation = () => {
      navigator.geolocation.getCurrentPosition(
        position => {
          setLocation({
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          })
          setShowLocationPermissionModal(false)
        },
        error => {
          console.error('위치 정보를 가져올 수 없습니다:', error)
          if (error.code === error.PERMISSION_DENIED) {
            setShowLocationPermissionModal(true)
          }
        }
      )
    }

    // 권한 상태 확인 후 요청
    navigator.permissions?.query({ name: 'geolocation' }).then(result => {
      if (result.state === 'denied') {
        setShowLocationPermissionModal(true)
      } else {
        requestLocation()
      }
    }) ?? requestLocation()
  }, [])

  const { data: neighborhoodData } = useLocateNeighborhood(
    {
      latitude: location?.latitude ?? '',
      longitude: location?.longitude ?? ''
    },
    !!location
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

      {neighborhoodData && (
        <div className="px-4 pt-2 text-xl font-bold">
          {neighborhoodData.sido} {neighborhoodData.sigungu}{' '}
          {neighborhoodData.eupmyeondong}
        </div>
      )}

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

      {/* 위치 권한 요청 모달 */}
      {showLocationPermissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6">
            <h3 className="mb-2 text-lg font-bold">위치 권한이 필요합니다</h3>
            <p className="mb-4 text-sm text-neutral-600">
              내 주변의 대여 물품을 보려면 위치 권한을 허용해주세요. 브라우저
              설정에서 위치 권한을 허용한 후 새로고침해주세요.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 rounded-lg bg-black py-2 font-medium text-white">
                새로고침
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
