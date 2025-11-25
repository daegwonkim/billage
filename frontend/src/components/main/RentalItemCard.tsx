import type { RentalItemsCard } from '@/models/RentalItem'
import { getTimeAgo } from '@/utils/utils'
import { MapPin, Package, MessageCircleMore, Heart } from 'lucide-react'

interface RentalItemCardProps {
  rentalItem: RentalItemsCard
  onClick?: () => void
}

export function RentalItemCard({ rentalItem, onClick }: RentalItemCardProps) {
  return (
    <div
      key={rentalItem.id}
      onClick={onClick}
      style={{
        height: '125px',
        backgroundColor: 'white',
        marginBottom: '3px',
        padding: '16px'
      }}>
      <div style={{ height: '125px', display: 'flex', gap: '12px' }}>
        <div style={{ width: '125px' }}>
          <img
            src={rentalItem.thumbnailImageUrl}
            alt={rentalItem.name}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '8px',
              objectFit: 'cover',
              flexShrink: 0
            }}
          />
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0
          }}>
          <h3
            style={{
              fontSize: '15px',
              fontWeight: '500',
              margin: '0px 0px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}>
            {rentalItem.name}
          </h3>

          <div style={{ position: 'relative', marginTop: 'auto' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                color: '#666',
                marginBottom: '6px'
              }}>
              <MapPin
                size={18}
                color="#ff4d4f"
              />
              <span
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                {rentalItem.address}
              </span>
              {rentalItem.createdAt && (
                <>
                  <span style={{ margin: '0 4px' }}>|</span>
                  <span>{getTimeAgo(new Date(rentalItem.createdAt))}</span>
                </>
              )}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '2px',
                marginBottom: '2px'
              }}>
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                {Number(rentalItem.pricePerDay).toLocaleString()}
              </span>
              <span style={{ fontSize: '14px', color: '#666' }}>원 / 일</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '2px',
                marginBottom: '2px'
              }}>
              <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                {Number(rentalItem.pricePerWeek).toLocaleString()}
              </span>
              <span style={{ fontSize: '14px', color: '#666' }}>원 / 주</span>
            </div>

            <div
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                color: '#8B939F'
              }}>
              {rentalItem.rentals > 0 && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                  <Package size={16} />
                  {rentalItem.rentals}
                </span>
              )}
              {rentalItem.chats > 0 && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                  <MessageCircleMore size={16} />
                  {rentalItem.chats}
                </span>
              )}
              {rentalItem.likes > 0 && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}>
                  <Heart size={16} />
                  {rentalItem.likes}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
