import {
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  LogOut,
  MapPinCheck,
  PackageCheck,
  Star,
  UserX
} from 'lucide-react'
import { useState } from 'react'
import defaultProfileImage from '@/assets/default-profile.png'
import { useAuth } from '@/contexts/AuthContext'
import { LoginPrompt } from '@/components/auth/LoginPrompt'
import { signOut } from '@/api/auth/auth'
import { useNavigate } from 'react-router-dom'
import {
  formatJoinDate,
  formatNeighborhoodVerifiedPeriod,
  formatRecentActivitySimple
} from '@/utils/utils'

export function MyBillage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [showMenu, setShowMenu] = useState(false)

  if (!user) {
    return <LoginPrompt />
  }

  // 임시 데이터 - 나중에 API로 대체
  const myItems = [
    {
      id: 1,
      title: '캠핑 텐트 4인용',
      price: 15000,
      imageUrl: 'https://placehold.co/120x120'
    },
    {
      id: 2,
      title: '소니 카메라 A7C',
      price: 30000,
      imageUrl: 'https://placehold.co/120x120'
    },
    {
      id: 3,
      title: '전동 킥보드',
      price: 10000,
      imageUrl: 'https://placehold.co/120x120'
    },
    {
      id: 4,
      title: '캠핑 텐트 4인용',
      price: 15000,
      imageUrl: 'https://placehold.co/120x120'
    },
    {
      id: 5,
      title: '소니 카메라 A7C',
      price: 30000,
      imageUrl: 'https://placehold.co/120x120'
    },
    {
      id: 6,
      title: '전동 킥보드',
      price: 10000,
      imageUrl: 'https://placehold.co/120x120'
    }
  ]

  const reviews = [
    {
      id: 1,
      reviewer: '마챠랏떼',
      profileImageUrl: defaultProfileImage,
      neighborhood: '영등포구 당산동6가',
      content: '물건 상태가 좋고 친절하셨어요!',
      rating: 5,
      date: '2일 전',
      images: [
        'https://placehold.co/80x80',
        'https://placehold.co/80x80',
        'https://placehold.co/80x80'
      ]
    },
    {
      id: 2,
      reviewer: '망고스틴',
      profileImageUrl: defaultProfileImage,
      neighborhood: '영등포구 당산동',
      content: '시간 약속을 잘 지키시네요',
      rating: 4,
      date: '7일 전',
      images: []
    },
    {
      id: 2,
      reviewer: '망고스틴',
      profileImageUrl: defaultProfileImage,
      neighborhood: '영등포구 당산동',
      content: '시간 약속을 잘 지키시네요',
      rating: 4,
      date: '7일 전',
      images: []
    },
    {
      id: 2,
      reviewer: '망고스틴',
      profileImageUrl: defaultProfileImage,
      neighborhood: '영등포구 당산동',
      content: '시간 약속을 잘 지키시네요',
      rating: 4,
      date: '7일 전',
      images: []
    }
  ]

  const handleLogout = async () => {
    await signOut()
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen w-md bg-white pb-20">
      {/* 상단 바 */}
      <div className="relative flex h-14 items-center border-b border-gray-100 px-4">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-2 rounded-lg p-2 transition-colors hover:bg-gray-50">
          <ChevronLeft
            size={24}
            className="text-neutral-700"
          />
        </button>
        <div className="flex-1 text-center text-base font-extrabold text-neutral-900">
          My 빌리지
        </div>
      </div>

      {/* 프로필 섹션 */}
      <div className="border-b border-gray-100 bg-white px-4 py-6">
        <div className="flex items-center gap-4 pb-3">
          {/* 프로필 이미지 */}
          <div className="flex h-18 w-18 items-center justify-center rounded-full bg-gray-100">
            <img
              src={
                user.profileImageUrl
                  ? user.profileImageUrl
                  : defaultProfileImage
              }
              alt="프로필"
              className="h-full w-full rounded-full object-cover"
            />
          </div>

          {/* 사용자 정보 */}
          <div className="flex-1">
            <h2 className="mb-1 text-xl font-bold text-neutral-900">
              {user.nickname}
            </h2>
            <div className="flex gap-1 text-sm">
              <div>
                #{user.publicId} •{' '}
                {formatRecentActivitySimple(user.lastActiveAt)}
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
            <div>{formatJoinDate(user.createdAt)}</div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <MapPinCheck size={19} />
            <div className="flex gap-1">
              <div>
                {formatNeighborhoodVerifiedPeriod(user.neighborhoodVerifiedAt)}
              </div>
              ·
              <div className="text-neutral-500">
                {user.neighborhood.sigungu} {user.neighborhood.eupmyeondong}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <PackageCheck size={19} />
            <div>
              대여해준 횟수 {user.rentOutCount}회 · 빌린 횟수 {user.rentInCount}
              회
            </div>
          </div>
        </div>

        {/* 프로필 편집 버튼 */}
        <button className="mt-4 w-full rounded-lg border bg-black py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800">
          프로필 편집
        </button>
      </div>

      {/* 판매 물품 섹션 - 수평 스크롤 */}
      <div className="py-4">
        <div className="flex items-center justify-between px-4 pb-3">
          <h3 className="text-base font-bold text-neutral-900">대여 물품 13</h3>
          <button className="group flex items-center text-sm text-neutral-500">
            전체보기
            <ChevronRight
              size={16}
              className="icon-arrow-move"
            />
          </button>
        </div>
        <div className="scrollbar-hide flex gap-3 overflow-x-auto px-4">
          {myItems.slice(0, 10).map(item => (
            <div
              key={item.id}
              className="w-28 shrink-0 cursor-pointer">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="mb-2 h-28 w-28 rounded-lg object-cover"
              />
              <p className="truncate text-sm text-neutral-800">{item.title}</p>
              <p className="text-sm font-semibold text-neutral-900">
                <div className="font-bold">
                  {item.price.toLocaleString()}
                  <span className="text-xs text-gray-500">원 / 일</span>
                </div>
                <div className="font-bold">
                  {item.price.toLocaleString()}
                  <span className="text-xs text-gray-500">원 / 주</span>
                </div>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 받은 후기 섹션 - 리스트 */}
      <div className="border-t border-gray-100 py-4">
        <div className="flex items-center justify-between px-4 pb-3">
          <h3 className="text-base font-bold text-neutral-900">받은 후기 9</h3>
          <button className="group flex items-center text-sm text-neutral-500">
            전체보기
            <ChevronRight
              size={16}
              className="icon-arrow-move"
            />
          </button>
        </div>
        <div className="px-4">
          {reviews.slice(0, 3).map(review => (
            <div
              key={review.id}
              className="flex gap-3 border-b border-gray-100 py-3 last:border-b-0">
              {/* 프로필 이미지 */}
              <img
                src={review.profileImageUrl}
                alt={review.reviewer}
                className="h-10 w-10 shrink-0 rounded-full object-cover"
              />
              {/* 후기 내용 */}
              <div className="flex-1">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-neutral-800">
                      {review.reviewer}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {review.neighborhood}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-400">
                    {review.date}
                  </span>
                </div>
                <div className="mb-2 flex items-center gap-0.5">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className="fill-indigo-300 text-indigo-300"
                    />
                  ))}
                </div>
                <p className="text-sm text-neutral-600">{review.content}</p>
                {/* 리뷰 이미지 */}
                {review.images.length > 0 && (
                  <div className="mt-2 flex gap-2">
                    {review.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`리뷰 이미지 ${index + 1}`}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
