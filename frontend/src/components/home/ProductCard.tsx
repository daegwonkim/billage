import type { Product } from '../../types'
import { MapPin, Package, MessageCircleMore, Heart } from 'lucide-react'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div
      key={product.id}
      style={{
        height: '144px',
        backgroundColor: 'white',
        marginBottom: '4px',
        padding: '16px'
      }}>
      <div style={{ height: '144px', display: 'flex', gap: '12px' }}>
        <div style={{ width: '144px' }}>
          <img
            src={product.image}
            alt={product.title}
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
              fontSize: '17px',
              fontWeight: '700',
              margin: '6px 0px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}>
            {product.title}
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
                color="#3b82f6"
              />
              <span
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                {product.location}
              </span>
              {product.time && (
                <>
                  <span style={{ margin: '0 4px' }}>|</span>
                  <span>{product.time}</span>
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
                {product.priceDay}
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
                {product.priceWeek}
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
                gap: '10px',
                fontSize: '15px',
                color: '#8B939F'
              }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                <Package size={18} />
                {product.rentals}
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                <MessageCircleMore size={18} />
                {product.comments}
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '2px'
                }}>
                <Heart size={18} />
                {product.likes}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
