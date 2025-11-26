import { RentalItemDetailBottom } from '@/components/detail/RentalItemDetailBottom'
import { RentalItemDetailHeader } from '@/components/detail/RentalItemDetailHeader'
import { RentalItemDetailImages } from '@/components/detail/RentalItemDetailImages'
import { RentalItemDetailInfo } from '@/components/detail/RentalItemDetailInfo'
import { RentalItemDetailSellerItems } from '@/components/detail/RentalItemDetailSellerItems'
import { RentalItemDetailSimilarItems } from '@/components/detail/RentalItemDetailSimilarItems'
import { RentalItemDetailSeller } from '@/components/detail/RentalItemDetailSeller'
import { useRentalItemDetail } from '@/hooks/useRentalItemDetail'
import { useNavigate, useParams } from 'react-router-dom'

export function RentalItemDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  if (!id) {
    return <div>Error: Rental item ID is missing.</div>
  }

  const {
    data: rentalItemData,
    isLoading: rentalItemLoading,
    error: rentalItemError
  } = useRentalItemDetail(id)

  if (rentalItemLoading) {
    return <div>Loading...</div>
  }

  if (rentalItemError || !rentalItemData) {
    return <div>Error: {rentalItemError?.message}</div>
  }

  const imageUrls = rentalItemData.imageUrls

  return (
    <div
      style={{
        backgroundColor: 'white',
        minHeight: '100vh',
        paddingBottom: '115px'
      }}>
      <RentalItemDetailHeader navigate={navigate} />
      <RentalItemDetailImages imageUrls={imageUrls} />
      <RentalItemDetailSeller rentalItem={rentalItemData} />
      <hr
        style={{
          width: '90%',
          height: '0.5px',
          border: 'none',
          backgroundColor: '#888',
          opacity: '0.5'
        }}
      />
      <RentalItemDetailInfo rentalItem={rentalItemData} />
      <hr
        style={{
          width: '90%',
          height: '0.5px',
          border: 'none',
          backgroundColor: '#888',
          opacity: '0.5'
        }}
      />
      <RentalItemDetailSimilarItems rentalItemId={id} />
      <hr
        style={{
          width: '90%',
          height: '0.5px',
          border: 'none',
          backgroundColor: '#888',
          opacity: '0.5'
        }}
      />
      <RentalItemDetailSellerItems
        seller={rentalItemData.seller}
        rentalItemId={id}
      />
      <RentalItemDetailBottom
        isLiked={rentalItemData.isLiked}
        pricePerDay={rentalItemData.pricePerDay}
        pricePerWeek={rentalItemData.pricePerWeek}
      />
    </div>
  )
}
