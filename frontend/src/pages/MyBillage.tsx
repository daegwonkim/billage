import {
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  LogOut,
  MapPinCheck,
  PackageCheck,
  PackageOpen,
  Star,
  UserX
} from 'lucide-react'
import { useRef, useState } from 'react'
import defaultProfileImage from '@/assets/default-profile.png'
import { useAuth } from '@/contexts/AuthContext'
import { LoginPrompt } from '@/components/auth/LoginPrompt'
import { signOut } from '@/api/auth/auth'
import { useNavigate } from 'react-router-dom'
import {
  formatCompactPrice,
  formatJoinDate,
  formatNeighborhoodVerifiedPeriod,
  formatRecentActivitySimple
} from '@/utils/utils'
import { useGetUserRentalItems } from '@/hooks/useUser'

export function MyBillage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [showMenu, setShowMenu] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [hasMoved, setHasMoved] = useState(false)

  if (!user) {
    return <LoginPrompt />
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    setHasMoved(false)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    setHasMoved(true)
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = x - startX
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleItemClick = (itemId: number) => {
    if (!hasMoved) {
      navigate(`/rental-items/${itemId}`)
    }
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollRef.current) return
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft
    const walk = x - startX
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const {
    data: userRentalItemData,
    isLoading: userRentalItemLoading,
    error: userRentalItemError
  } = useGetUserRentalItems(user.id)

  if (userRentalItemError || !userRentalItemData) {
    return
  }

  const hasItems = userRentalItemData.rentalItems.length > 0

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
          <h3 className="text-base font-bold text-neutral-900">
            대여 물품 {userRentalItemData.rentalItems.length}
          </h3>
          {hasItems ? (
            <button className="group flex items-center text-sm text-neutral-500">
              전체보기
              <ChevronRight
                size={16}
                className="icon-arrow-move"
              />
            </button>
          ) : (
            <></>
          )}
        </div>
        <div className="scrollbar-hide flex justify-center gap-3 overflow-x-auto">
          {hasItems ? (
            <div
              ref={scrollRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className={`hide-scrollbar flex gap-2.5 overflow-x-auto overflow-y-hidden px-4 select-none`}
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              }}>
              {userRentalItemData.rentalItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className="flex w-[110px] shrink-0 cursor-pointer flex-col">
                  <img
                    src={item.thumbnailImageUrl}
                    className="pointer-events-none mb-1.5 h-[110px] w-[110px] rounded-[10px] object-cover"
                  />
                  <div className="flex flex-1 flex-col gap-0.5">
                    <div
                      className="flex-1 overflow-hidden text-sm text-ellipsis"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                      {item.title}
                    </div>
                    <div className="mt-auto">
                      <div className="text-[15px] font-bold">
                        {formatCompactPrice(item.pricePerDay)}
                        <span className="text-[13px] text-gray-600">
                          원 / 일
                        </span>
                      </div>
                      <div className="text-[15px] font-bold">
                        {formatCompactPrice(item.pricePerWeek)}
                        <span className="text-[13px] text-gray-600">
                          원 / 주
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 px-4 py-8 text-gray-400">
              <PackageOpen size={32} />
              <div className="text-sm">아직 등록한 물품이 없어요</div>
            </div>
          )}
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
