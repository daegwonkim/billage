import {
  CalendarCheck,
  EllipsisVertical,
  Frown,
  LogOut,
  MapPinCheck,
  PackageCheck,
  UserX
} from 'lucide-react'
import { useState } from 'react'
import defaultProfileImage from '@/assets/default-profile.png'
import { signOut } from '@/api/auth/auth'
import { useNavigate } from 'react-router-dom'
import {
  formatJoinDate,
  formatNeighborhoodVerifiedPeriod,
  formatRecentActivitySimple
} from '@/utils/utils'
import { useGetMe } from '@/hooks/useUser'
import { useAuth } from '@/contexts/AuthContext'

export function Profile() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [showMenu, setShowMenu] = useState(false)

  const {
    data: userProfileData,
    isLoading: userProfileLoading,
    isError: userProfileError
  } = useGetMe()

  if (userProfileLoading) {
    return (
      <div className="border-b border-gray-100 px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="h-18 w-18 animate-pulse rounded-full bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-7 w-45 animate-pulse rounded bg-gray-200" />
            <div className="h-5 w-60 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
        </div>

        <div className="mt-3 mb-2 flex flex-col gap-2">
          <div className="h-5 w-60 animate-pulse rounded bg-gray-200" />
          <div className="h-5 w-60 animate-pulse rounded bg-gray-200" />
          <div className="h-5 w-60 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="mt-4 h-10 animate-pulse rounded bg-gray-200 py-2.5" />
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

  const handleLogout = async () => {
    await signOut()
    logout()
    navigate('/')
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
              onClick={() => setShowMenu(!showMenu)}
              className="rounded-lg p-2 transition-colors hover:bg-gray-50">
              <EllipsisVertical
                size={24}
                className={`icon-rotate text-gray-600 ${showMenu ? 'active' : ''}`}
              />
            </button>

            {/* 드롭다운 메뉴 */}
            {showMenu && (
              <>
                <div
                  className="animate-fade-in fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="animate-dropdown absolute top-9 right-2 z-20 w-27 origin-top-right rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                  <button
                    onClick={() => {
                      setShowMenu(false)
                      handleLogout()
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-neutral-700 transition-colors hover:bg-gray-50">
                    <LogOut size={16} />
                    로그아웃
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false)
                      // TODO: 회원탈퇴 처리
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-500 transition-colors hover:bg-gray-50">
                    <UserX size={16} />
                    회원탈퇴
                  </button>
                </div>
              </>
            )}
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
