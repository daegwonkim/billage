import { useGetSimilarRentalItems } from '@/hooks/useRentalItem'
import { formatCompactPrice } from '@/utils/utils'
import { ChevronRight, Frown } from 'lucide-react'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface RentalItemDetailSimilarItemsProps {
  rentalItemId: number
}

export function RentalItemDetailSimilarItems({
  rentalItemId
}: RentalItemDetailSimilarItemsProps) {
  const navigate = useNavigate()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [hasMoved, setHasMoved] = useState(false)

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
    const walk = (x - startX) * 2
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
  } = useGetSimilarRentalItems(rentalItemId)

  if (similarRentalItemLoading) {
    return <div>Loading...</div>
  }

  if (similarRentalItemError || !similarRentalItemData) {
    return null
  }

  const hasItems = similarRentalItemData.rentalItems.length > 0

  return (
    <div className="overflow-hidden pt-4 pb-4">
      <div className="px-4">
        <div className="flex items-center justify-between pb-4">
          <h3 className="text-lg font-bold">지금 보고 있는 물품과 비슷해요</h3>
          {hasItems && <ChevronRight color="#707070" />}
        </div>
      </div>
      {hasItems ? (
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
      ) : (
        <div className="flex flex-col items-center gap-2 px-4 py-8 text-gray-400">
          <Frown size={32} />
          <div className="text-sm">앗! 아직 준비된 물건이 없어요</div>
        </div>
      )}
    </div>
  )
}
