import { ChevronRight, Frown, Loader2, PackageOpen } from 'lucide-react'
import { useRef, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { LoginPrompt } from '@/components/auth/LoginPrompt'
import { useNavigate } from 'react-router-dom'
import { formatCompactPrice } from '@/utils/utils'
import { useGetUserRentalItems } from '@/hooks/useUser'

export function UserRentalItems() {
  const navigate = useNavigate()
  const { isAuthenticated, userId } = useAuth()

  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [hasMoved, setHasMoved] = useState(false)

  const {
    data: userRentalItemData,
    isLoading: userRentalItemLoading,
    error: userRentalItemError
  } = useGetUserRentalItems(userId)

  if (!isAuthenticated) {
    return <LoginPrompt />
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    setHasMoved(false)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    setHasMoved(true)
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = x - startX
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleItemClick = (itemId: number) => {
    if (!hasMoved) {
      navigate(`/rental-items/${itemId}`)
    }
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollRef.current) return
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft
    const walk = x - startX
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  if (userRentalItemError || !userRentalItemData) {
    return (
      <div className="flex h-[271px] flex-col items-center justify-center gap-2 text-gray-400">
        <Frown size={32} />
        <div className="text-sm">앗! 데이터를 조회하는데 실패했어요</div>
      </div>
    )
  }

  const hasItems = userRentalItemData.rentalItems.length > 0

  const renderRentalItems = () => {
    if (userRentalItemLoading) {
      return (
        <div
          className="hide-scrollbar flex gap-2.5 overflow-x-auto overflow-y-hidden px-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}>
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex w-[110px] shrink-0 animate-pulse flex-col">
              {/* 이미지 */}
              <div className="mb-1.5 h-[110px] w-[110px] rounded-[10px] bg-gray-200" />

              {/* 제목 */}
              <div className="flex flex-1 flex-col gap-0.5">
                <div className="h-4 w-full rounded bg-gray-200" />
                <div className="h-4 w-3/4 rounded bg-gray-200" />

                {/* 가격 */}
                <div className="mt-auto space-y-1">
                  <div className="h-5 w-20 rounded bg-gray-200" />
                  <div className="h-5 w-20 rounded bg-gray-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (!hasItems) {
      return (
        <div className="flex flex-col items-center gap-2 px-4 py-8 text-gray-400">
          <PackageOpen size={32} />
          <div className="text-sm">아직 등록한 물품이 없어요</div>
        </div>
      )
    }

    return (
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`hide-scrollbar flex gap-2.5 overflow-x-auto overflow-y-hidden px-4 select-none`}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}>
        {userRentalItemData.rentalItems.map(item => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className="flex w-[110px] shrink-0 cursor-pointer flex-col">
            <img
              src={item.thumbnailImageUrl}
              className="pointer-events-none mb-1.5 h-[110px] w-[110px] rounded-[10px] object-cover"
            />
            <div className="flex flex-1 flex-col gap-0.5">
              <div
                className="flex-1 overflow-hidden text-sm text-ellipsis"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                {item.title}
              </div>
              <div className="mt-auto">
                <div className="text-[15px] font-bold">
                  {formatCompactPrice(item.pricePerDay)}
                  <span className="text-[13px] text-gray-600">원 / 일</span>
                </div>
                <div className="text-[15px] font-bold">
                  {formatCompactPrice(item.pricePerWeek)}
                  <span className="text-[13px] text-gray-600">원 / 주</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      {/* 판매 물품 섹션 - 수평 스크롤 */}
      <div className="py-4">
        <div className="flex items-center justify-between px-4 pb-3">
          <h3 className="text-base font-bold text-neutral-900">
            대여 물품 {userRentalItemData.rentalItems.length}
          </h3>
          {hasItems ? (
            <button className="group flex items-center text-sm text-neutral-500">
              전체보기
              <ChevronRight
                size={16}
                className="icon-arrow-move"
              />
            </button>
          ) : (
            <></>
          )}
        </div>
        <div className="scrollbar-hide flex justify-center gap-3 overflow-x-auto">
          {renderRentalItems()}
        </div>
      </div>
    </>
  )
}
