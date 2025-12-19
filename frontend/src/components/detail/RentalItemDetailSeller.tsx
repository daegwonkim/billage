import { useEffect, useState } from 'react'
import { MapPin } from 'lucide-react'
import lowIcon from '@/assets/level/low.png'
import fairIcon from '@/assets/level/fair.png'
import normalIcon from '@/assets/level/normal.png'
import highIcon from '@/assets/level/high.png'
import topIcon from '@/assets/level/top.png'
import defaultProfileImage from '@/assets/default-profile.png'
import '@/css/BottomSheet.css'
import type { GetRentalItemResponse } from '@/api/rentall_item/dto/GetRentalItems'
import { generateSignedUrl } from '@/api/storage/storage'

interface RentalItemDetailSellerProps {
  rentalItem: GetRentalItemResponse
}

export function RentalItemDetailSeller({
  rentalItem
}: RentalItemDetailSellerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [profileImageUrl, setProfileImageUrl] = useState<string>('')

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (rentalItem.seller?.profileImageUrl) {
        try {
          const { signedUrl } = await generateSignedUrl({
            bucket: 'user-profile-images',
            fileKey: rentalItem.seller.profileImageUrl
          })
          setProfileImageUrl(signedUrl)
        } catch (error) {
          console.error('Failed to fetch profile image URL:', error)
        }
      }
    }

    fetchProfileImage()
  }, [rentalItem.seller?.profileImageUrl])

  return (
    <>
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-3">
          <img
            src={profileImageUrl || defaultProfileImage}
            alt={rentalItem.seller?.nickname}
            className="h-12 w-12 rounded-full object-cover"
          />
          <div>
            <div className="text-lg font-bold">
              {rentalItem.seller?.nickname}
            </div>
            <div className="flex items-center gap-0.5">
              <MapPin
                size={15}
                color="#ff4d4f"
              />
              <span className="text-[13px] text-gray-600">
                {rentalItem.seller.address}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 text-base text-[#d79537]">
            99Lv
            <div className="h-[30px] w-[30px]">
              <img
                src={topIcon}
                className="w-full"
              />
            </div>
          </div>

          <div
            onClick={() => setIsDialogOpen(true)}
            className="cursor-pointer text-[13px] underline underline-offset-2">
            신뢰레벨
          </div>
        </div>
      </div>

      {isDialogOpen && (
        <div className="justify-center">
          <div
            className="bottom-sheet-backdrop"
            onClick={() => setIsDialogOpen(false)}>
            <div
              className="bottom-sheet-panel"
              onClick={e => e.stopPropagation()}>
              <div className="flex justify-center gap-[30px]">
                <img
                  src={lowIcon}
                  className="level-icon h-10 w-10"
                  style={{ animationDelay: '0.1s' }}
                />
                <img
                  src={fairIcon}
                  className="level-icon h-10 w-10"
                  style={{ animationDelay: '0.2s' }}
                />
                <img
                  src={normalIcon}
                  className="level-icon h-10 w-10"
                  style={{ animationDelay: '0.3s' }}
                />
                <img
                  src={highIcon}
                  className="level-icon h-10 w-10"
                  style={{ animationDelay: '0.4s' }}
                />
                <img
                  src={topIcon}
                  className="level-icon h-10 w-10"
                  style={{ animationDelay: '0.5s' }}
                />
              </div>
              <h3 className="mb-3 font-bold">신뢰레벨이란?</h3>
              <p className="text-base text-gray-600">
                신뢰레벨은 다른 사용자로부터 받은 신뢰평가, 후기를 포함한 여러
                활동들을 모아 계산한 신뢰 지표에요.
              </p>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="w-full bg-[#262626] text-white">
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
