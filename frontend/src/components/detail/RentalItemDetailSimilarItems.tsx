import { useSimilarRentalItems } from '@/hooks/RentalItem'
import { ChevronRight } from 'lucide-react'
import { useRef, useState } from 'react'

interface RentalItemDetailSimilarItemsProps {
  rentalItemId: string
}

export function RentalItemDetailSimilarItems({
  rentalItemId
}: RentalItemDetailSimilarItemsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 2
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
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
    const walk = (x - startX) * 2
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const {
    data: similarRentalItemData,
    isLoading: similarRentalItemLoading,
    error: similarRentalItemError
  } = useSimilarRentalItems(rentalItemId)

  if (similarRentalItemLoading) {
    return <div>Loading...</div>
  }

  if (similarRentalItemError || !similarRentalItemData) {
    return <div>Error: {similarRentalItemError?.message}</div>
  }

  return (
    <div className="overflow-hidden pb-4">
      <div className="px-4">
        <div className="flex items-center justify-between">
          <h3>지금 보고 있는 물품과 비슷해요</h3>
          <ChevronRight color="#707070" />
        </div>
      </div>
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`hide-scrollbar flex gap-2.5 overflow-x-auto overflow-y-hidden px-4 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}>
        {similarRentalItemData.rentalItems.map(item => (
          <div
            key={item.id}
            className="w-[110px] shrink-0">
            <img
              src={item.thumbnailImageUrl}
              className="pointer-events-none h-[110px] w-[110px] rounded-[10px] object-cover"
            />
            <div
              className="overflow-hidden text-sm text-ellipsis"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}>
              {item.name}
            </div>
            <div className="text-[15px] font-bold">
              {item.pricePerDay}
              <span className="text-[13px] text-gray-600">원 / 일</span>
            </div>
            <div className="text-[15px] font-bold">
              {item.pricePerWeek}
              <span className="text-[13px] text-gray-600">원 / 주</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
