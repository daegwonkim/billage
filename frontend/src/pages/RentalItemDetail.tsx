import { getRentalItem } from '@/api/detail'
import { RentalItemDetailBottom } from '@/components/detail/RentalItemDetailBottom'
import { RentalItemDetailHeader } from '@/components/detail/RentalItemDetailHeader'
import { RentalItemDetailImage } from '@/components/detail/RentalItemDetailImage'
import { RentalItemDetailInfo } from '@/components/detail/RentalItemDetailInfo'
import { RentalItemDetailUser } from '@/components/detail/RentalItemDetailUser'
import { RentalItemDetailSimilar } from '@/components/detail/RentalItemDetailSimilar'
import { RentalItemDetailSeller } from '@/components/detail/RentalItemDetailSeller'
import { useFetch } from '@/hooks/useFetch'
import { useNavigate, useParams } from 'react-router-dom'

export function RentalItemDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  if (!id) {
    return <div>Error: Rental item ID is missing.</div>
  }

  const {
    data: rentalItemData,
    loading: rentalItemLoading,
    error: rentalItemError
  } = useFetch(() => getRentalItem(id))

  if (rentalItemLoading) {
    return <div>Loading...</div>
  }

  if (rentalItemError || !rentalItemData) {
    return <div>Error: {rentalItemError}</div>
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
      <RentalItemDetailImage imageUrls={imageUrls} />
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
      <RentalItemDetailSimilar rentalItemId={id} />
      <hr
        style={{
          width: '90%',
          height: '0.5px',
          border: 'none',
          backgroundColor: '#888',
          opacity: '0.5'
        }}
      />
      <RentalItemDetailUser
        seller={rentalItemData.seller.name}
        userId={rentalItemData.seller.id}
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
