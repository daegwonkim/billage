import { RentalItemDetailBottom } from '@/components/detail/RentalItemDetailBottom'
import { RentalItemDetailHeader } from '@/components/detail/RentalItemDetailHeader'
import { RentalItemDetailImages } from '@/components/detail/RentalItemDetailImages'
import { RentalItemDetailInfo } from '@/components/detail/RentalItemDetailInfo'
import { RentalItemDetailSellerItems } from '@/components/detail/RentalItemDetailSellerItems'
import { RentalItemDetailSimilarItems } from '@/components/detail/RentalItemDetailSimilarItems'
import { RentalItemDetailSeller } from '@/components/detail/RentalItemDetailSeller'
import { useNavigate, useParams } from 'react-router-dom'
import { useRentalItemDetail } from '@/hooks/RentalItem'

export function RentalItemDetail() {
  const navigate = useNavigate()

  const { id } = useParams<{ id: string }>()

  if (!id) {
    return <div>상품 정보를 불러오는데 실패했습니다.</div>
  }

  const {
    data: rentalItemData,
    isLoading: rentalItemLoading,
    error: rentalItemError
  } = useRentalItemDetail(id)

  if (rentalItemLoading) {
    return <div>상품 정보를 불러오는 중입니다...</div>
  }

  if (rentalItemError || !rentalItemData) {
    return <div>상품 정보를 불러오는데 실패했습니다.</div>
  }

  const imageKeys = rentalItemData.imageKeys

  return (
    <div className="min-h-screen w-md bg-white pb-[115px]">
      <RentalItemDetailHeader navigate={navigate} />
      <RentalItemDetailImages imageKeys={imageKeys} />
      <RentalItemDetailSeller rentalItem={rentalItemData} />
      <hr className="h-[0.5px] w-[90%] border-none bg-gray-500 opacity-50" />
      <RentalItemDetailInfo rentalItem={rentalItemData} />
      <hr className="h-[0.5px] w-[90%] border-none bg-gray-500 opacity-50" />
      {/* <RentalItemDetailSimilarItems rentalItemId={id} />
      <hr className="h-[0.5px] w-[90%] border-none bg-gray-500 opacity-50" />
      <RentalItemDetailSellerItems
        seller={rentalItemData.seller}
        rentalItemId={id}
      /> */}
      <RentalItemDetailBottom
        liked={rentalItemData.likeed}
        pricePerDay={rentalItemData.pricePerDay}
        pricePerWeek={rentalItemData.pricePerWeek}
      />
    </div>
  )
}
