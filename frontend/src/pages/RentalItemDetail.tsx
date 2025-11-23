import { getRentalItem } from '@/api/main'
import { RentalItemDetailBottom } from '@/components/detail/RentalItemDetailBottom'
import { RentalItemDetailHeader } from '@/components/detail/RentalItemDetailHeader'
import { RentalItemDetailImage } from '@/components/detail/RentalItemDetailImage'
import { RentalItemDetailInfo } from '@/components/detail/RentalItemDetailInfo'
import { RentalItemDetailOther } from '@/components/detail/RentalItemDetailOther'
import { RentalItemDetailRelated } from '@/components/detail/RentalItemDetailRelated'
import { RentalItemDetailSeller } from '@/components/detail/RentalItemDetailSeller'
import type { RentalItemDetailViewModel } from '@/models/RentalItem'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export function RentalItemDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [rentalItem, setRentalItem] =
    useState<RentalItemDetailViewModel | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRentalItem = async () => {
      try {
        setLoading(true)
        const response = await getRentalItem(id!)
        setRentalItem(response)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchRentalItem()
  }, [id])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!rentalItem) {
    throw new Error('상품 조회 오류')
  }

  const images = rentalItem.images

  return (
    <div
      style={{
        backgroundColor: 'white',
        minHeight: '100vh',
        paddingBottom: '115px'
      }}>
      <RentalItemDetailHeader navigate={navigate} />
      <RentalItemDetailImage
        images={images}
        currentImageIndex={currentImageIndex}
      />
      <RentalItemDetailSeller rentalItem={rentalItem} />
      <hr
        style={{
          width: '90%',
          height: '0.5px',
          border: 'none',
          backgroundColor: '#888',
          opacity: '0.5'
        }}
      />
      <RentalItemDetailInfo rentalItem={rentalItem} />
      <hr
        style={{
          width: '90%',
          height: '0.5px',
          border: 'none',
          backgroundColor: '#888',
          opacity: '0.5'
        }}
      />
      <RentalItemDetailRelated />
      <hr
        style={{
          width: '90%',
          height: '0.5px',
          border: 'none',
          backgroundColor: '#888',
          opacity: '0.5'
        }}
      />
      <RentalItemDetailOther seller={rentalItem.seller.name} />
      <RentalItemDetailBottom
        isLiked={rentalItem.isLiked}
        pricePerDay={rentalItem.pricePerDay}
        pricePerWeek={rentalItem.pricePerWeek}
      />
    </div>
  )
}
