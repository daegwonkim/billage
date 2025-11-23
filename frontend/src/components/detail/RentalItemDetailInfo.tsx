import type { RentalItemDetailViewModel } from '@/models/RentalItem'
import { getTimeAgo } from '@/utils/utils'
import { MapPin } from 'lucide-react'

interface RentalItemDetailInfoProps {
  rentalItem: RentalItemDetailViewModel
}

export function RentalItemDetailInfo({
  rentalItem
}: RentalItemDetailInfoProps) {
  const infoItems = [
    rentalItem.rentals > 0 ? `대여 ${rentalItem.rentals}` : null,
    rentalItem.comments > 0 ? `채팅 ${rentalItem.comments}` : null,
    rentalItem.likes > 0 ? `관심 ${rentalItem.likes}` : null,
    rentalItem.views > 0 ? `조회 ${rentalItem.views}` : null
  ].filter(Boolean)

  return (
    <div style={{ padding: '16px 16px' }}>
      <h1
        style={{
          fontSize: '22px',
          fontWeight: 'bold',
          marginTop: '0px',
          marginBottom: '12px'
        }}>
        {rentalItem.name}
      </h1>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '20px',
          fontSize: '14px',
          color: '#666'
        }}>
        {rentalItem.category && (
          <span
            style={{
              fontSize: '15px',
              textDecoration: 'underline',
              textUnderlineOffset: '1.5px'
            }}>
            {rentalItem.category}
          </span>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <MapPin
            size={18}
            color="#ff4d4f"
          />
          <span>{rentalItem.seller.address}</span>
        </div>
        <span style={{ marginLeft: 'auto' }}>
          {rentalItem.createdAt && (
            <span>{getTimeAgo(new Date(rentalItem.createdAt))}</span>
          )}
        </span>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h2
          style={{
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '12px'
          }}>
          상세 설명
        </h2>
        <p
          style={{
            fontSize: '15px',
            lineHeight: '1.6',
            color: '#333',
            whiteSpace: 'pre-line'
          }}>
          {rentalItem.description}
        </p>
      </div>
      <div
        style={{
          display: 'flex',
          fontSize: '13px',
          color: '#777',
          gap: '4px'
        }}>
        {infoItems.map((item, index) => (
          <span
            key={index}
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {item}
            {index < infoItems.length - 1 && <span>·</span>}
          </span>
        ))}
      </div>
    </div>
  )
}
