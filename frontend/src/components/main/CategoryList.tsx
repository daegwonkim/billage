import { useRef, useState } from 'react'
import type { RentalItemCategory } from '@/models/Category'

interface CategoryListProps {
  categories: RentalItemCategory[]
}

export function CategoryList({ categories }: CategoryListProps) {
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
      style={{
        backgroundColor: 'white',
        overflowX: 'auto',
        padding: '12px 16px',
        borderTop: '1px solid #f0f0f0',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch'
      }}
      className="hide-scrollbar">
      <div style={{ display: 'flex', gap: '15px', minWidth: 'max-content' }}>
        {categories.map((cat, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative'
            }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                marginBottom: '6px',
                position: 'relative',
                pointerEvents: 'none' // 드래그 방해 방지
              }}>
              <img
                src={cat.icon}
                alt={cat.label}
                width={35}
                height={35}
                style={{ pointerEvents: 'none' }} // 이미지 드래그 방지
              />
            </div>
            <span
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#333',
                whiteSpace: 'nowrap',
                pointerEvents: 'none' // 텍스트 선택 방지
              }}>
              {cat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
