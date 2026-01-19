import { RentalItemDetailBottom } from '@/components/detail/RentalItemDetailBottom'
import { RentalItemDetailHeader } from '@/components/detail/RentalItemDetailHeader'
import { RentalItemDetailImages } from '@/components/detail/RentalItemDetailImages'
import { RentalItemDetailInfo } from '@/components/detail/RentalItemDetailInfo'
import { RentalItemDetailSellerItems } from '@/components/detail/RentalItemDetailSellerItems'
import { RentalItemDetailSimilarItems } from '@/components/detail/RentalItemDetailSimilarItems'
import { RentalItemDetailSeller } from '@/components/detail/RentalItemDetailSeller'
import { RentalItemDetailSkeleton } from '@/components/detail/RentalItemDetailSkeleton'
import { BottomSheet } from '@/components/common/BottomSheet'
import { BottomSheetItem } from '@/components/common/BottomSheetItem'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetRentalItem } from '@/hooks/useRentalItem'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'
import { Pencil, Trash2, Flag } from 'lucide-react'

export function RentalItemDetail() {
  const navigate = useNavigate()
  const { userId } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  let { id } = useParams<{ id: string }>()
  const numericId = Number(id)

  if (!id) {
    return (
      <div className="flex min-h-screen w-md items-center justify-center bg-white">
        <div className="text-center">
          <p className="mb-2 text-lg font-semibold text-neutral-800">
            상품 정보를 불러오는데 실패했습니다
          </p>
          <p className="mb-4 text-sm text-neutral-500">
            잠시 후 다시 시도해주세요
          </p>
          <button
            onClick={() => navigate(-1)}
            className="rounded-lg bg-black px-6 py-2 font-medium text-white transition-colors hover:bg-gray-800">
            돌아가기
          </button>
        </div>
      </div>
    )
  }

  const {
    data: rentalItemData,
    isLoading: rentalItemLoading,
    error: rentalItemError
  } = useGetRentalItem(numericId)

  if (rentalItemLoading) {
    return <RentalItemDetailSkeleton />
  }

  if (rentalItemError || !rentalItemData) {
    return (
      <div className="flex min-h-screen w-md items-center justify-center bg-white">
        <div className="text-center">
          <p className="mb-2 text-lg font-semibold text-neutral-800">
            상품 정보를 불러오는데 실패했습니다
          </p>
          <p className="mb-4 text-sm text-neutral-500">
            잠시 후 다시 시도해주세요
          </p>
          <button
            onClick={() => navigate(-1)}
            className="rounded-lg bg-black px-6 py-2 font-medium text-white transition-colors hover:bg-gray-800">
            돌아가기
          </button>
        </div>
      </div>
    )
  }

  const imageUrls = rentalItemData.imageUrls
  const isOwner = userId === rentalItemData.seller.id

  const handleEdit = () => {
    setIsMenuOpen(false)
    navigate(`/rental-items/${numericId}/edit`)
  }

  const handleDelete = () => {
    setIsMenuOpen(false)
    // TODO: 삭제 확인 모달 및 삭제 API 호출
  }

  const handleReport = () => {
    setIsMenuOpen(false)
    // TODO: 신고 페이지 이동 또는 모달
  }

  return (
    <div className="min-h-screen w-md bg-white pb-[115px]">
      <RentalItemDetailHeader
        navigate={navigate}
        onMenuClick={() => setIsMenuOpen(true)}
      />
      <RentalItemDetailImages imageUrls={imageUrls} />
      <RentalItemDetailSeller rentalItem={rentalItemData} />
      <hr className="mx-auto h-[0.5px] w-[90%] border-none bg-neutral-400 opacity-50" />
      <RentalItemDetailInfo rentalItem={rentalItemData} />
      <hr className="mx-auto h-[0.5px] w-[90%] border-none bg-neutral-400 opacity-50" />
      <RentalItemDetailSimilarItems rentalItemId={numericId} />
      <hr className="mx-auto h-[0.5px] w-[90%] border-none bg-neutral-400 opacity-50" />
      <RentalItemDetailSellerItems
        seller={rentalItemData.seller}
        rentalItemId={numericId}
      />
      <RentalItemDetailBottom
        liked={rentalItemData.likeed}
        pricePerDay={rentalItemData.pricePerDay}
        pricePerWeek={rentalItemData.pricePerWeek}
      />

      <BottomSheet
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        title={isOwner ? '내 게시글 관리' : '게시글 메뉴'}
        showCancelButton={true}
        showCloseButton={false}
        showDragHandle={true}>
        {isOwner ? (
          <>
            <BottomSheetItem
              icon={<Pencil size={20} />}
              label="수정하기"
              onClick={handleEdit}
            />
            <BottomSheetItem
              icon={<Trash2 size={20} />}
              label="삭제하기"
              variant="danger"
              onClick={handleDelete}
            />
          </>
        ) : (
          <BottomSheetItem
            icon={<Flag size={20} />}
            label="신고하기"
            variant="danger"
            onClick={handleReport}
          />
        )}
      </BottomSheet>
    </div>
  )
}
