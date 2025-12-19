import { useEffect, useState } from 'react'
import lowIcon from '@/assets/level/low.png'
import fairIcon from '@/assets/level/fair.png'
import normalIcon from '@/assets/level/normal.png'
import highIcon from '@/assets/level/high.png'
import topIcon from '@/assets/level/top.png'
import defaultProfileImage from '@/assets/default-profile.png'
import type { GetRentalItemResponse } from '@/api/rentall_item/dto/GetRentalItem'
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
            className="h-15 w-15 rounded-full object-cover"
          />
          <div>
            <span className="text-[15px] font-semibold text-gray-400">
              누가 빌려주나요?
            </span>
            <div className="text-lg font-extrabold">
              {rentalItem.seller?.nickname}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 text-base font-bold text-purple-700">
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
            className="cursor-pointer text-[13px] font-semibold underline underline-offset-2">
            신뢰레벨
          </div>
        </div>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 z-[999] flex items-end justify-center bg-black/40">
          <div
            className="absolute inset-0"
            onClick={() => setIsDialogOpen(false)}
          />
          <div
            className="animate-slide-up relative w-full max-w-md rounded-t-2xl bg-white p-5 text-center shadow-[0_-4px_10px_rgba(0,0,0,0.15)]"
            onClick={e => e.stopPropagation()}>
            <div className="mb-4 flex justify-center gap-[30px]">
              <img
                src={lowIcon}
                className="animate-fade-in-scale h-10 w-10 opacity-0"
                style={{
                  animationDelay: '0.1s',
                  animationFillMode: 'forwards'
                }}
              />
              <img
                src={fairIcon}
                className="animate-fade-in-scale h-10 w-10 opacity-0"
                style={{
                  animationDelay: '0.2s',
                  animationFillMode: 'forwards'
                }}
              />
              <img
                src={normalIcon}
                className="animate-fade-in-scale h-10 w-10 opacity-0"
                style={{
                  animationDelay: '0.3s',
                  animationFillMode: 'forwards'
                }}
              />
              <img
                src={highIcon}
                className="animate-fade-in-scale h-10 w-10 opacity-0"
                style={{
                  animationDelay: '0.4s',
                  animationFillMode: 'forwards'
                }}
              />
              <img
                src={topIcon}
                className="animate-fade-in-scale h-10 w-10 opacity-0"
                style={{
                  animationDelay: '0.5s',
                  animationFillMode: 'forwards'
                }}
              />
            </div>
            <h3 className="mb-3 text-lg font-bold">신뢰레벨이란?</h3>
            <p className="mb-4 text-base text-gray-600">
              신뢰레벨은 다른 사용자로부터 받은 신뢰평가, 후기를 포함한 여러
              활동들을 모아 계산한 신뢰 지표에요
            </p>
            <button
              onClick={() => setIsDialogOpen(false)}
              className="w-full rounded-lg bg-[#262626] py-3 font-semibold text-white">
              확인
            </button>
          </div>
        </div>
      )}
    </>
  )
}
