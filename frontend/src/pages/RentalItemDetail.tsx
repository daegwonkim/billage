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
import { useState, useEffect } from 'react'
import { LoginPrompt } from '@/components/auth/LoginPrompt'
import { Pencil, Trash2, Flag } from 'lucide-react'
import { like, remove, unlike } from '@/api/rentall_item/rentalItem'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useCheckChatRoom } from '@/hooks/useChat'

export function RentalItemDetail() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { userId, isAuthenticated } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [liked, setLiked] = useState(false)
  const [isLikeAnimating, setIsLikeAnimating] = useState(false)

  const { id } = useParams<{ id: string }>()
  const numericId = Number(id)
  const checkChatRoomMutation = useCheckChatRoom()

  if (!id) {
    return (
      <div className="flex min-h-screen w-md items-center justify-center bg-white">
        <div className="text-center">
          <p className="mb-2 text-lg font-semibold text-neutral-800">
            물품 정보를 불러오는데 실패했습어요
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

  const deleteMutation = useMutation({
    mutationFn: () => remove(numericId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentalItems'] })
      navigate('/', { replace: true })
      toast.success('게시물이 삭제됐어요')
    },
    onError: () => {
      toast.error('게시물 삭제에 실패했어요')
    }
  })

  const likeMutation = useMutation({
    mutationFn: () => like(numericId),
    onSuccess: () => {
      setLiked(true)
      queryClient.invalidateQueries({ queryKey: ['rentalItem', numericId] })
    },
    onError: () => {
      toast.error('좋아요 등록에 실패했어요')
    }
  })

  const unlikeMutation = useMutation({
    mutationFn: () => unlike(numericId),
    onSuccess: () => {
      setLiked(false)
      queryClient.invalidateQueries({ queryKey: ['rentalItem', numericId] })
    },
    onError: () => {
      toast.error('좋아요 해제에 실패했어요')
    }
  })

  useEffect(() => {
    if (rentalItemData) {
      setLiked(rentalItemData.liked ?? false)
    }
  }, [rentalItemData?.liked])

  const isLikePending = likeMutation.isPending || unlikeMutation.isPending

  const handleLikeClick = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }

    if (isLikePending) return

    setIsLikeAnimating(true)
    setTimeout(() => setIsLikeAnimating(false), 300)

    if (liked) {
      unlikeMutation.mutate()
    } else {
      likeMutation.mutate()
    }
  }

  if (rentalItemLoading) {
    return <RentalItemDetailSkeleton />
  }

  if (rentalItemError || !rentalItemData) {
    return (
      <div className="flex min-h-screen w-md items-center justify-center bg-white">
        <div className="text-center">
          <p className="mb-2 text-lg font-semibold text-neutral-800">
            물품 정보를 불러오는데 실패했어요
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

  const handleModify = () => {
    setIsMenuOpen(false)
    navigate(`/rental-items/${numericId}/modify`, { replace: true })
  }

  const handleDelete = () => {
    setIsMenuOpen(false)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    setIsDeleteModalOpen(false)
    deleteMutation.mutate()
  }

  const handleReport = () => {
    setIsMenuOpen(false)
    // TODO: 신고 페이지 이동 또는 모달
  }

  const handleChatClick = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }

    checkChatRoomMutation.mutate(numericId, {
      onSuccess: data => {
        if (data.chatRoomId) {
          navigate(`/chat/${data.chatRoomId}`)
        } else {
          navigate(`/chat/new?rentalItemId=${numericId}`)
        }
      },
      onError: () => {
        toast.error('채팅방 연결에 실패했어요')
      }
    })
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
        liked={liked}
        pricePerDay={rentalItemData.pricePerDay}
        pricePerWeek={rentalItemData.pricePerWeek}
        onLikeClick={handleLikeClick}
        isAnimating={isLikeAnimating}
        onChatClick={handleChatClick}
        isOwner={isOwner}
      />

      {showLoginModal && (
        <LoginPrompt
          isModal
          onClose={() => setShowLoginModal(false)}
        />
      )}

      <BottomSheet
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        title={isOwner ? '내 대여 물품 관리' : '대여 물품 메뉴'}
        showCancelButton={true}
        showCloseButton={false}
        showDragHandle={true}>
        {isOwner ? (
          <>
            <BottomSheetItem
              icon={<Pencil size={20} />}
              label="수정하기"
              onClick={handleModify}
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

      {/* 삭제 확인 모달 */}
      {isDeleteModalOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setIsDeleteModalOpen(false)}
          />
          <div className="fixed top-1/2 left-1/2 z-60 w-80 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-lg font-bold text-neutral-900">
              등록 물품 삭제
            </h3>
            <p className="mb-6 text-sm text-neutral-600">
              정말로 이 물품을 삭제하시겠어요?
              <br />
              삭제된 물품은 복구할 수 없어요.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 rounded-lg bg-gray-100 py-3 font-medium text-neutral-700 transition-colors hover:bg-gray-200">
                취소
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
                className="flex-1 rounded-lg bg-red-600 py-3 font-medium text-white transition-colors hover:bg-red-700 disabled:bg-red-300">
                {deleteMutation.isPending ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
