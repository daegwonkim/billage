import { useState } from 'react'
import type { RentalItemDetailResponse } from '@/models/RentalItem'
import { MapPin } from 'lucide-react'
import lowIcon from '@/assets/level/low.png'
import fairIcon from '@/assets/level/fair.png'
import normalIcon from '@/assets/level/normal.png'
import highIcon from '@/assets/level/high.png'
import topIcon from '@/assets/level/top.png'
import '@/css/BottomSheet.css'

interface RentalItemDetailSellerProps {
  rentalItem: RentalItemDetailResponse
}

export function RentalItemDetailSeller({
  rentalItem
}: RentalItemDetailSellerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <div
        style={{
          display: 'flex',
          padding: '10px 16px',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
          <img
            src={rentalItem.seller?.profileImageUrl}
            alt={rentalItem.seller?.name}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
          <div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
              {rentalItem.seller?.name}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px'
              }}>
              <MapPin
                size={15}
                color="#ff4d4f"
              />
              <span style={{ fontSize: '13px', color: '#666' }}>
                {rentalItem.seller.address}
              </span>
            </div>
          </div>
        </div>

        {rentalItem.seller.trustLevel && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end'
            }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                color: '#d79537',
                fontSize: '16px',
                gap: '4px'
              }}>
              {rentalItem.seller.trustLevel}Lv
              <div style={{ width: '30px', height: '30px' }}>
                <img
                  src={topIcon}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div
              onClick={() => setIsDialogOpen(true)}
              style={{
                textDecoration: 'underline',
                textUnderlineOffset: '2px',
                fontSize: '13px',
                cursor: 'pointer'
              }}>
              신뢰레벨
            </div>
          </div>
        )}
      </div>

      {isDialogOpen && (
        <div style={{ justifyContent: 'conter' }}>
          <div
            className="bottom-sheet-backdrop"
            onClick={() => setIsDialogOpen(false)}>
            <div
              className="bottom-sheet-panel"
              onClick={e => e.stopPropagation()}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '30px'
                }}>
                <img
                  src={lowIcon}
                  className="level-icon"
                  style={{
                    width: '40px',
                    height: '40px',
                    animationDelay: '0.1s'
                  }}
                />
                <img
                  src={fairIcon}
                  className="level-icon"
                  style={{
                    width: '40px',
                    height: '40px',
                    animationDelay: '0.2s'
                  }}
                />
                <img
                  src={normalIcon}
                  className="level-icon"
                  style={{
                    width: '40px',
                    height: '40px',
                    animationDelay: '0.3s'
                  }}
                />
                <img
                  src={highIcon}
                  className="level-icon"
                  style={{
                    width: '40px',
                    height: '40px',
                    animationDelay: '0.4s'
                  }}
                />
                <img
                  src={topIcon}
                  className="level-icon"
                  style={{
                    width: '40px',
                    height: '40px',
                    animationDelay: '0.5s'
                  }}
                />
              </div>
              <h3
                style={{
                  fontWeight: 'bold',
                  marginBottom: '12px'
                }}>
                신뢰레벨이란?
              </h3>
              <p style={{ fontSize: '16px', color: '#555' }}>
                신뢰레벨은 다른 사용자로부터 받은 신뢰평가, 후기를 포함한 여러
                활동들을 모아 계산한 신뢰 지표에요.
              </p>
              <button
                onClick={() => setIsDialogOpen(false)}
                style={{
                  width: '100%',
                  backgroundColor: '#262626',
                  color: 'white'
                }}>
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
