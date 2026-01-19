import {
  CalendarCheck,
  Frown,
  MapPinCheck,
  PackageCheck,
  Settings
} from 'lucide-react'
import defaultProfileImage from '@/assets/default-profile.png'
import { useNavigate } from 'react-router-dom'
import {
  formatJoinDate,
  formatNeighborhoodVerifiedPeriod,
  formatRecentActivitySimple
} from '@/utils/utils'
import { useGetMe } from '@/hooks/useUser'

export function Profile() {
  const navigate = useNavigate()

  const {
    data: userProfileData,
    isLoading: userProfileLoading,
    isError: userProfileError
  } = useGetMe()

  if (userProfileLoading) {
    return (
      <div className="border-b border-gray-100 bg-white px-4 py-6">
        <div className="flex items-center gap-4 pb-3">
          <div className="h-18 w-18 animate-pulse rounded-full bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-7 w-32 animate-pulse rounded bg-gray-200" />
            <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-200" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <div className="h-5 w-5 animate-pulse rounded bg-gray-200" />
            <div className="h-5 w-36 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="flex items-center gap-1">
            <div className="h-5 w-5 animate-pulse rounded bg-gray-200" />
            <div className="h-5 w-52 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="flex items-center gap-1">
            <div className="h-5 w-5 animate-pulse rounded bg-gray-200" />
            <div className="h-5 w-48 animate-pulse rounded bg-gray-200" />
          </div>
        </div>

        <div className="mt-4 h-11 w-full animate-pulse rounded-lg bg-gray-200" />
      </div>
    )
  }

  if (userProfileError || !userProfileData) {
    return (
      <div className="flex h-[267px] flex-col items-center justify-center gap-2 border-b border-gray-100 text-gray-400">
        <Frown size={32} />
        <div className="text-sm">앗! 데이터를 조회하는데 실패했어요</div>
      </div>
    )
  }

  return (
    <>
      {/* 프로필 섹션 */}
      <div className="border-b border-gray-100 bg-white px-4 py-6">
        <div className="flex items-center gap-4 pb-3">
          {/* 프로필 이미지 */}
          <div className="flex h-18 w-18 items-center justify-center rounded-full bg-gray-100">
            <img
              src={
                userProfileData.profileImageUrl
                  ? userProfileData.profileImageUrl
                  : defaultProfileImage
              }
              alt="프로필"
              className="h-full w-full rounded-full object-cover"
            />
          </div>

          {/* 사용자 정보 */}
          <div className="flex-1">
            <h2 className="mb-1 text-xl font-bold text-neutral-900">
              {userProfileData.nickname}
            </h2>
            <div className="flex gap-1 text-sm">
              <div>
                #{userProfileData.publicId} •{' '}
                {formatRecentActivitySimple(userProfileData.lastActiveAt)}
              </div>
            </div>
          </div>

          {/* 설정 아이콘 */}
          <div className="relative">
            <button
              onClick={() => navigate('/my/settings')}
              className="rounded-lg p-2 transition-colors hover:bg-gray-50">
              <Settings
                size={24}
                className="text-gray-600"
              />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1 text-sm">
            <CalendarCheck size={19} />
            <div>{formatJoinDate(userProfileData.createdAt)}</div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <MapPinCheck size={19} />
            <div className="flex gap-1">
              <div>
                {formatNeighborhoodVerifiedPeriod(
                  userProfileData.neighborhoodVerifiedAt
                )}
              </div>
              ·
              <div className="text-neutral-500">
                {userProfileData.neighborhood.sigungu}{' '}
                {userProfileData.neighborhood.eupmyeondong}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <PackageCheck size={19} />
            <div>
              대여해준 횟수 {userProfileData.rentOutCount}회 · 빌린 횟수{' '}
              {userProfileData.rentInCount}회
            </div>
          </div>
        </div>

        {/* 프로필 편집 버튼 */}
        <button className="mt-4 w-full rounded-lg border bg-black py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800">
          프로필 편집
        </button>
      </div>
    </>
  )
}
