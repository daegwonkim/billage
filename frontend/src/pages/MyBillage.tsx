import { ChevronLeft } from 'lucide-react'

import { useAuth } from '@/contexts/AuthContext'
import { LoginPrompt } from '@/components/auth/LoginPrompt'
import { useNavigate } from 'react-router-dom'
import { Profile } from '@/components/my/Profile'
import { UserRentalItems } from '@/components/my/UserRentalItems'
import { Reviews } from '@/components/my/Reviews'

export function MyBillage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <LoginPrompt />
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

      <Profile />
      <UserRentalItems />
      {/* <Reviews /> */}
    </div>
  )
}
