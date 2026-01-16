import { ChevronLeft, ChevronRight, Settings } from 'lucide-react'
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
        <div className="flex items-center gap-4">
          {/* 프로필 이미지 */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
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
            {user.neighborhood.sigungu} {user.neighborhood.eupmyeondong}
          </div>

          {/* 설정 아이콘 */}
          <button className="rounded-lg p-2 transition-colors hover:bg-gray-50">
            <Settings
              size={24}
              className="text-gray-600"
            />
          </button>
        </div>

        {/* 프로필 편집 버튼 */}
        <button className="mt-4 w-full rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-gray-50">
          프로필 편집
        </button>
      </div>

      {/* 메뉴 리스트 */}
      <div className="mt-2">
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
