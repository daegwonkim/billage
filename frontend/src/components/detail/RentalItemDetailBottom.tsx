import { Heart } from 'lucide-react'

interface RentalItemDetailBottomProps {
  isLiked: boolean
  pricePerDay: number
  pricePerWeek: number
}

export function RentalItemDetailBottom({
  isLiked,
  pricePerDay,
  pricePerWeek
}: RentalItemDetailBottomProps) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '368px',
        backgroundColor: 'white',
        borderTop: '1px solid #e5e5e5',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
      }}>
      <Heart
        size={35}
        color={isLiked ? '#ff4d4f' : '#888'}
        fill={isLiked ? '#ff4d4f' : 'none'}
        style={{ flexShrink: 0, cursor: 'pointer' }}
      />
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: '17px',
            fontWeight: 'bold',
            marginBottom: '2px'
          }}>
          {Number(pricePerDay).toLocaleString()}
          <span style={{ fontSize: '14px', color: '#666' }}>원 / 일</span>
        </div>
        <div
          style={{ fontSize: '17px', fontWeight: 'bold', marginBottom: '2px' }}>
          {Number(pricePerWeek).toLocaleString()}
          <span style={{ fontSize: '14px', color: '#666' }}>원 / 주</span>
        </div>
      </div>
      <button
        style={{
          backgroundColor: '#ff4d4f',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '16px 32px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
        채팅하기
      </button>
    </div>
  )
}
