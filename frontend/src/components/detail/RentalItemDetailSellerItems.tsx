import type { Seller } from '@/api/rentall_item/dto/GetRentalItems'
import { useGetUserRentalItems } from '@/hooks/User'
import { ChevronRight } from 'lucide-react'
import { useRef, useState } from 'react'

interface RentalItemDetailSellerItemsProps {
  seller: Seller
  rentalItemId: string
}

export function RentalItemDetailSellerItems({
  seller,
  rentalItemId
}: RentalItemDetailSellerItemsProps) {
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
    data: sellerRentalItemData,
    isLoading: sellerRentalItemLoading,
    error: sellerRentalItemError
  } = useGetUserRentalItems(seller.id, rentalItemId)

  if (sellerRentalItemLoading) {
    return <div>Loading...</div>
  }

  if (sellerRentalItemError || !sellerRentalItemData) {
    return <div>Error: {sellerRentalItemError?.message}</div>
  }

  return (
    <div style={{ overflow: 'hidden' }}>
      <div style={{ padding: '0px 16px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
          <h3>{seller.nickname}님의 다른 대여 물품</h3>
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
        style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          overflowY: 'hidden',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          paddingLeft: '16px',
          paddingRight: '16px'
        }}
        className="hide-scrollbar">
        {sellerRentalItemData.rentalItems.map(item => (
          <div
            key={item.id}
            style={{
              width: '110px',
              flexShrink: 0
            }}>
            <img
              src={item.thumbnailImageUrl}
              style={{
                width: '110px',
                height: '110px',
                borderRadius: '10px',
                objectFit: 'cover',
                pointerEvents: 'none'
              }}
            />
            <div
              style={{
                fontSize: '14px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}>
              {item.name}
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700 }}>
              {item.pricePerDay}
              <span style={{ fontSize: '13px', color: '#666' }}>원 / 일</span>
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700 }}>
              {item.pricePerWeek}
              <span style={{ fontSize: '13px', color: '#666' }}>원 / 주</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
