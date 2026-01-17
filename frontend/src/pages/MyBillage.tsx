import {
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  MapPinCheck,
  PackageCheck
} from 'lucide-react'
import defaultProfileImage from '@/assets/default-profile.png'
import { useAuth } from '@/contexts/AuthContext'
import { LoginPrompt } from '@/components/auth/LoginPrompt'
import { signOut } from '@/api/auth/auth'
import { useNavigate } from 'react-router-dom'

export function MyBillage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  if (!user) {
    return <LoginPrompt />
  }

  const menuItems = [
    { id: 'my-items', label: '내가 등록한 물품', count: 0 },
    { id: 'borrowed-items', label: '내가 빌린 물품', count: 0 },
    { id: 'favorites', label: '관심 물품', count: 0 },
    { id: 'history', label: '거래 내역', count: 0 }
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
                {user.neighborhood.sigungu} {user.neighborhood.eupmyeondong} •
                최근 3일 이내 활동
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1 text-sm">
            <CalendarCheck size={19} />
            <div>2025년 11월 30일 가입</div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <MapPinCheck size={19} />
            <div className="flex gap-1">
              <div>동네 인증 (3개월째)</div>·
              <div className="text-neutral-500">
                {user.neighborhood.sigungu} {user.neighborhood.eupmyeondong}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <PackageCheck size={19} />
            <div>대여해준 횟수 12회 · 빌린 횟수 5회</div>
          </div>
        </div>

        {/* 프로필 편집 버튼 */}
        <button className="mt-4 w-full rounded-lg border bg-black py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800">
          프로필 편집
        </button>
      </div>

      {/* 메뉴 리스트 */}
      <div>
        {menuItems.map((item, index) => (
          <button
            key={item.id}
            className={`flex w-full items-center justify-between px-4 py-4 transition-colors hover:bg-gray-50 ${
              index !== menuItems.length - 1 ? 'border-b border-gray-50' : ''
            }`}>
            <span className="text-[15px] font-medium text-neutral-800">
              {item.label}
            </span>
            <div className="flex items-center gap-2">
              {item.count > 0 && (
                <span className="text-sm text-neutral-400">{item.count}</span>
              )}
              <ChevronRight
                size={20}
                className="text-gray-400"
              />
            </div>
          </button>
        ))}
      </div>

      {/* 로그아웃 버튼 */}
      <div className="mt-6 px-4">
        <button
          className="w-full rounded-lg py-3 text-sm font-medium text-neutral-500 transition-colors hover:bg-gray-50"
          onClick={handleLogout}>
          로그아웃
        </button>
      </div>
    </div>
  )
}
